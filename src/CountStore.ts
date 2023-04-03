import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
  
const countFileDetails = {
  path: 'count.txt',
  directory: Directory.Data,
  encoding: Encoding.UTF8,
};


export const useCountStore = defineStore('countStore', () => {
  const _count = ref(0);
  setUpCountFromDevice();
  async function setUpCountFromDevice() {
    try {
      const countValueFromFile = Number((await Filesystem.readFile(countFileDetails)));
      if (!Number.isNaN(countValueFromFile)) {
        _count.value = countValueFromFile;
      } else {
        await Filesystem.deleteFile(countFileDetails);
      }
    } catch (e) {
      console.error('Unable to read file', e);
    }
  };
  
  const writeCountToDevice = async (count: number) => {
    try {
      await Filesystem.writeFile({
        data: count.toString(),
        ...countFileDetails,
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