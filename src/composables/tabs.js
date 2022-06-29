import { ref, unref, computed, markRaw } from "vue";

/*
  [{
    name: "GlobalFeed",
    component: GlobalFeed,
    requiresAuth: false
  },  
  {...}]
*/

const useTabs = (initTabsConfig, isAuthorized) => {
  const mapConfigToMeta = (tabConfig) => ({
    name: tabConfig.name,
    display: tabConfig.display,
    requiresAuth: tabConfig.requiresAuth,
    component: markRaw(tabConfig.component),
    props: tabConfig.props,
    onSelect: tabConfig.onSelect,
    autoSelected: tabConfig.autoSelected
  });

  const tabsMeta = ref(
    unref(initTabsConfig).map((tab) => mapConfigToMeta(tab))
  );

  const updateTabsConfig = (tabsConfig) => {
    tabsMeta.value = unref(tabsConfig).map((tab) => mapConfigToMeta(tab));
    setAutoSelectedTab();
  };

  const setAutoSelectedTab = () => {
    const autoSelectedTab = tabsMeta.value.find((tab) => tab.autoSelected);
    if (autoSelectedTab) {
      setCurrentTab(autoSelectedTab.name);
    }
  };

  const accessibleTabs = computed(() =>
    !isAuthorized
      ? tabsMeta.value.filter((tab) => tab.requiresAuth !== true)
      : tabsMeta.value
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

  const addTab = (newTabConfig) => {
    const newTab =
      !isAuthorized && newTabConfig.requiresAuth === true
        ? null
        : mapConfigToMeta(newTabConfig);
    if (newTab) accessibleTabs.value.push(newTab);
  };

  const removeTab = (tabName) => {
    tabsMeta.value = tabsMeta.value.filter((tab) => tab.name !== tabName);
  };

  setAutoSelectedTab();

  return {
    accessibleTabs,
    currentTab,
    currentTabComponent,
    setCurrentTab,
    addTab,
    removeTab,
    updateTabsConfig
  };
};

export default useTabs;
