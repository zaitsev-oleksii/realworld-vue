import { ref } from "vue";

const useLoading = (initState = false, initMessage) => {
  const isLoading = ref(initState);
  const message = ref(initMessage);

  const start = (msg) => {
    isLoading.value = true;
    if (msg) message.value = msg;
  };

  const stop = () => {
    isLoading.value = false;
    message.value = undefined;
  };

  return [
    { isLoading, message },
    { start, stop }
  ];
};

export default useLoading;
