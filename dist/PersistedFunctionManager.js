"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePersistedFunctionManager = exports.QUIT_PERSISTED_FUNCTION = void 0;
const uuidv4_1 = require("uuidv4");
const utils_1 = require("./utils");
exports.QUIT_PERSISTED_FUNCTION = "QUIT_PERSISTED_FUNCTION";
function initializePersistedFunctionManager(managerId, fileSystem) {
    // Persisted Executions
    const _persistedExecutions = fileSystem
        .readFile(managerId)
        .then((saveFileString) => {
        return (0, utils_1.exists)(saveFileString)
            ? JSON.parse(saveFileString)
            : {};
    });
    async function getPersistedExecution(functionId) {
        const persistedExecutions = await _persistedExecutions;
        return persistedExecutions[functionId];
    }
    async function updatePersistedExecution(functionId, state) {
        const persistedExecutions = await _persistedExecutions;
        if ((0, utils_1.exists)(state)) {
            persistedExecutions[functionId] = state;
        }
        else {
            delete persistedExecutions[functionId];
        }
        requestSave();
    }
    // Start save Loop
    let saveIndex = 0;
    let lastSaveIndex = saveIndex;
    function requestSave() {
        saveIndex += 1;
    }
    _persistedExecutions.then(async (persistedExecutions) => {
        while (true) {
            if (lastSaveIndex !== saveIndex) {
                await fileSystem.writeFile(managerId, JSON.stringify(persistedExecutions));
                lastSaveIndex = saveIndex;
            }
            await (0, utils_1.sleep)(250);
        }
    });
    // Resume Functions
    const functionTypes = {};
    _persistedExecutions.then((persistedExecutions) => {
        for (const functionId in Object.keys(persistedExecutions)) {
            resumeFunction(functionId);
        }
    });
    async function resumeFunction(functionId) {
        // Load the function data
        const functionData = await getPersistedExecution(functionId);
        if (!(0, utils_1.exists)(functionData))
            return;
        const { functionTypeName, stageIndex: stageIndexToResumeFrom, props, } = functionData;
        // Wait for the function stages to be registered
        while (!Object.keys(functionTypes).includes(functionTypeName)) {
            await (0, utils_1.sleep)(100);
        }
        // Run the remaining stages
        const stages = functionTypes[functionTypeName];
        let shouldQuit = false;
        for (let stageIndex = stageIndexToResumeFrom; !shouldQuit && stageIndex < stages.length; stageIndex++) {
            const runStage = stages[stageIndex];
            const stageResult = await runStage(props);
            shouldQuit =
                stageResult === exports.QUIT_PERSISTED_FUNCTION ||
                    stageIndex === stages.length - 1;
            // Update Storage
            updatePersistedExecution(functionId, shouldQuit
                ? undefined
                : {
                    functionTypeName,
                    stageIndex: stageIndex + 1,
                    props: stageResult,
                });
        }
    }
    // Register Function Types
    return {
        createPersistedFunction(functionTypeName, runStage) {
            functionTypes[functionTypeName] = [runStage];
            function wrapInAddStage(wrapProps) {
                return Object.assign(wrapProps.func, {
                    addStage: (runStage) => {
                        functionTypes[functionTypeName].push(runStage);
                        return wrapInAddStage({
                            funcReturnType: {},
                            func: wrapProps.func,
                        });
                    },
                });
            }
            return wrapInAddStage({
                funcReturnType: {},
                func: async (props) => {
                    while (!(0, utils_1.exists)(_persistedExecutions))
                        (0, utils_1.sleep)(100);
                    const functionId = (0, uuidv4_1.uuid)();
                    updatePersistedExecution(functionId, {
                        functionTypeName,
                        stageIndex: 0,
                        props: props ?? {},
                    });
                    resumeFunction(functionId);
                },
            });
        },
        /**  */
        findFunctionData(where) {
            return Object.values(_persistedExecutions ?? {}).find(where);
        },
    };
}
exports.initializePersistedFunctionManager = initializePersistedFunctionManager;
