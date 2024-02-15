import { v4 as uuidv4 } from "uuid";
export function createPersistedFunction(localJsonFilePersister, func) {
    const steps = [func];
    const savedJson = localJsonFilePersister.start({
        activeFunctions: {},
    });
    async function doNextStep(instanceId) {
        const funcConfig = savedJson.data.activeFunctions[instanceId];
        if (funcConfig.step >= steps.length)
            return {};
        const stepFunc = steps[funcConfig.step];
        const stepResult = await stepFunc(...funcConfig.args);
        const nextStepIndex = funcConfig.step + 1;
        if (nextStepIndex < steps.length) {
            savedJson.batchUpdate((data) => {
                data.activeFunctions[instanceId] = {
                    step: nextStepIndex,
                    args: [stepResult],
                };
            });
            return await doNextStep(instanceId);
        }
        else {
            savedJson.batchUpdate((data) => {
                delete data.activeFunctions[instanceId];
            });
            return stepResult;
        }
    }
    savedJson.loadedFromLocalStorage.then(() => {
        Object.keys(savedJson.data.activeFunctions).forEach(doNextStep);
    });
    return Object.assign(async (...args) => {
        const instanceId = uuidv4();
        savedJson.batchUpdate(async (data) => {
            data.activeFunctions[instanceId] = { step: 0, args };
        });
        return await doNextStep(instanceId);
    }, {
        addStep(newStep) {
            steps.push(newStep);
            return this;
        },
    });
}
