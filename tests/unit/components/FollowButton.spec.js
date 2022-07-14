import { mount } from "@vue/test-utils";

import FollowButton from "@/components/FollowButton.vue";

const createComponent = (props) => mount(FollowButton, { props });

describe("FollowButton", () => {
  it("renders follow 'username'", () => {
    const wrapper = createComponent({ username: "Gerome", following: false });
    expect(wrapper.text()).toBe("Follow Gerome");
  });

  it("renders unfollow 'username'", () => {
    const wrapper = createComponent({ username: "Gerome", following: true });
    expect(wrapper.text()).toBe("Unfollow Gerome");
  });

  it("emits toggle-follow event on click", () => {
    const wrapper = createComponent({ username: "Gerome", following: false });
    wrapper.find("button").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("toggle-follow");
  });
});
