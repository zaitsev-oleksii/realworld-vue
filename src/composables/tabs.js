import { ref, computed, markRaw } from "vue";
import { useStore } from "vuex";

/*
  [{
    name: "GlobalFeed",
    component: GlobalFeed,
    requiresAuth: false
  },  
  {...}]
*/

const useTabs = (tabsMeta) => {
  const store = useStore();

  const accessibleTabs = (
    !store.getters.isAuthorized
      ? tabsMeta.filter((tab) => tab.requiresAuth !== true)
      : tabsMeta
  ).map((tab) => ({
    name: tab.name,
    display: tab.display,
    requiresAuth: tab.requiresAuth,
    component: markRaw(tab.component),
    props: tab.props
  }));

  const currentTab = ref(accessibleTabs[0]);

  const currentTabComponent = computed(() => currentTab.value.component);

  const setCurrentTab = (newTabName) => {
    const newTab = accessibleTabs.find((tab) => tab.name === newTabName);
    currentTab.value = newTab;
  };

  return { accessibleTabs, currentTab, currentTabComponent, setCurrentTab };
};

export default useTabs;
