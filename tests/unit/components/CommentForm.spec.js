import { mount } from "@vue/test-utils";
import { createStore } from "vuex";

import CommentForm from "@/components/CommentForm.vue";

const store = createStore({
  state: {
    user: {
      image: ""
    }
  }
});

const createComponent = (props) =>
  mount(CommentForm, { props, global: { plugins: [store] } });

describe("FollowButton", () => {
  it("doesn't emit new-comment event when submitting empty comment", async () => {
    const wrapper = createComponent();
    wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("new-comment")).toBe(undefined);
  });

  it("emits new-comment event on submit", async () => {
    const wrapper = createComponent();
    await wrapper.get("textarea").setValue("New comment text");
    wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("new-comment")[0][0]).toBe("New comment text");
  });
});
