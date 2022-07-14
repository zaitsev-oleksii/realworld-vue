import { mount } from "@vue/test-utils";

import FavoriteButton from "@/components/FavoriteButton.vue";

const createComponent = ({ props, slots }) =>
  mount(FavoriteButton, { props, slots });

describe("FavoriteButton", () => {
  it("renders follow 'username'", () => {
    const wrapper = createComponent({
      props: { favorited: false, favoritesCount: 1000 }
    });
    expect(wrapper.text()).toBe("1000");
  });

  it("renders unfollow 'username'", () => {
    const wrapper = createComponent({
      props: { favorited: true, favoritesCount: 1000 },
      slots: { default: "Unfavorite" }
    });
    expect(wrapper.text()).toBe("Unfavorite (1000)");
  });

  it("emits toggle-follow event on click", () => {
    const wrapper = createComponent({
      props: { favorited: true, favoritesCount: 1000 }
    });
    wrapper.find("button").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("toggle-favorite");
  });
});
