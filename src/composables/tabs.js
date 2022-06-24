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

  const accessibleTabs = ref(
    (!store.getters.isAuthorized
      ? tabsMeta.filter((tab) => tab.requiresAuth !== true)
      : tabsMeta
    ).map((tab) => ({
      name: tab.name,
      display: tab.display,
      requiresAuth: tab.requiresAuth,
      component: markRaw(tab.component),
      props: tab.props,
      onSelect: tab.onSelect
    }))
  );

  const currentTab = ref(accessibleTabs.value[0]);

  const currentTabComponent = computed(() => currentTab.value.component);

  const setCurrentTab = (newTabName) => {
    const newTab = accessibleTabs.value.find((tab) => tab.name === newTabName);
    currentTab.value = newTab;
    if (currentTab.value.onSelect) {
      currentTab.value.onSelect();
    }
  };

  const addTab = (newTabMeta) => {
    const newTab =
      !store.getters.isAuthorized && newTabMeta.requiresAuth === true
        ? null
        : {
            name: newTabMeta.name,
            display: newTabMeta.display,
            requiresAuth: newTabMeta.requiresAuth,
            component: markRaw(newTabMeta.component),
            props: newTabMeta.props
          };
    if (newTab) accessibleTabs.value.push(newTab);
  };

  const removeTab = (tabName) => {
    accessibleTabs.value = accessibleTabs.value.filter(
      (tab) => tab.name !== tabName
    );
  };

  return {
    accessibleTabs,
    currentTab,
    currentTabComponent,
    setCurrentTab,
    addTab,
    removeTab
  };
};

export default useTabs;
