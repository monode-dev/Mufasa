import { v4 as uuidv4 } from "uuid";
import { doNow } from "./Utils.js";
export function createPersistedFunction(localJsonFilePersister, func) {
    const steps = [func];
    let liveStepCount = 0;
    const savedJson = localJsonFilePersister.load({
        isPaused: false,
        activeFunctions: {},
    });
    resumeAll({ force: false });
    async function doNextStep(instanceId) {
        liveStepCount++;
        await doNow(async () => {
            try {
                await savedJson.loadedFromLocalStorage;
                if (savedJson.data.isPaused)
                    return;
                const funcConfig = savedJson.data.activeFunctions[instanceId];
                if (funcConfig.step >= steps.length)
                    return {};
                const stepFunc = steps[funcConfig.step];
                const stepResult = await stepFunc(...funcConfig.args);
                const nextStepIndex = funcConfig.step + 1;
                if (nextStepIndex < steps.length) {
                    savedJson.batchUpdate((data) => {
                        data.value.activeFunctions[instanceId] = {
                            step: nextStepIndex,
                            args: [stepResult],
                        };
                    });
                    await doNextStep(instanceId);
                }
                else {
                    await savedJson.batchUpdate((data) => {
                        delete data.value.activeFunctions[instanceId];
                    });
                }
            }
            catch (e) { }
        });
        liveStepCount--;
    }
    async function pauseAll() {
        await savedJson.loadedFromLocalStorage;
        if (savedJson.data.isPaused)
            return;
        savedJson.batchUpdate((data) => (data.value.isPaused = true));
        while (liveStepCount > 0)
            await new Promise((r) => setTimeout(r, 10));
    }
    async function resumeAll(options) {
        await savedJson.loadedFromLocalStorage;
        if (savedJson.data.isPaused) {
            if (!options.force)
                return;
            savedJson.batchUpdate((data) => (data.value.isPaused = false));
        }
        Object.keys(savedJson.data.activeFunctions).forEach(doNextStep);
    }
    return Object.assign((...args) => {
        doNow(async () => {
            const instanceId = uuidv4();
            await savedJson.batchUpdate(async (data) => {
                data.value.activeFunctions[instanceId] = { step: 0, args };
            });
            await doNextStep(instanceId);
        });
        return;
    }, {
        pauseAll,
        resumeAll: () => resumeAll({ force: true }),
        addStep(newStep) {
            steps.push(newStep);
            return this;
        },
    });
}
