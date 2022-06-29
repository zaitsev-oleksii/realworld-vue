<template>
  <div class="feed-toggle">
    <ul class="nav nav-pills outline-active">
      <li class="nav-item" v-for="tab in accessibleTabs" :key="tab.name">
        <a
          class="nav-link"
          :class="{
            active: currentTab.name === tab.name
          }"
          @click="setCurrentTab(tab.name)"
        >
          {{ tab.display }}
        </a>
      </li>
    </ul>
  </div>
  <component
    :is="currentTabComponent"
    v-bind="currentTab.props"
    :key="currentTab"
  />
</template>

<script>
import { watch } from "vue";
import useTabs from "../composables/tabs";

export default {
  name: "UTabs",
  props: {
    tabsMeta: {
      type: Object,
      required: true
    },
    isAuthorized: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const {
      accessibleTabs,
      currentTab,
      currentTabComponent,
      setCurrentTab,
      addTab,
      removeTab,
      updateTabsConfig
    } = useTabs(props.tabsMeta, props.isAuthorized);

    watch(
      () => props.tabsMeta,
      () => updateTabsConfig(props.tabsMeta)
    );

    return {
      accessibleTabs,
      currentTab,
      currentTabComponent,
      setCurrentTab,
      addTab,
      removeTab
    };
  }
};
</script>
