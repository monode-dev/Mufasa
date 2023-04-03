import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
  
const deviceOptions = {
  path: 'count.txt',
  directory: Directory.Data,
  encoding: Encoding.UTF8,
};


export const useCountStore = defineStore('countStore', () => {
  const _count = ref(0);
  setUpCountFromDevice();
  async function setUpCountFromDevice() {
    try {
      const countValueFromFile = Number((await Filesystem.readFile({
        ...deviceOptions
      })));
      if (!Number.isNaN(countValueFromFile)) {
        _count.value = countValueFromFile;
      }
    } catch (e) {
      console.error('Unable to read file', e);
    }
  };
  
  const writeCountToDevice = async (count: number) => {
    try {
      await Filesystem.writeFile({
        data: count.toString(),
        ...deviceOptions,
      });
    } catch (e) {
      console.error('Unable to write file', e);
    }
  };
  
  return {
    count: computed(() => _count),
    incCount() {
      _count.value += 1;
      writeCountToDevice(_count.value)
    }
  }
});