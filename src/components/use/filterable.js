import Vue from "vue";
import { watch, onBeforeDestroyed } from "../../magicApi";

export function useFilterable({ loadItems, initialFilters }) {
  const page = Vue.observable({ value: 1 });
  const filters = Vue.observable({
    ...initialFilters,
  });
  const items = Vue.observable({ value: [] });

  const syncHash = () => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const { page: pageValue, ...filtersValue } = Object.fromEntries(urlParams.entries());
    if (pageValue) {
      page.value = pageValue;
    }

    Object.entries(filtersValue).forEach(([key, value]) => {
      Vue.set(filters, key, value);
    });
  };

  const updateHash = () => {
    const urlParams = new URLSearchParams();
    if (page.value !== 1) {
      urlParams.append("page", page.value);
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        urlParams.append(key, value);
      }
    });
    window.location.hash = urlParams.toString();
  };

  const load = () =>
    loadItems({
      page: page.value,
      filters,
    }).then((result) => {
      items.value = result;
    });

  watch(
    () => page.value,
    () => {
      updateHash();
      load();
    }
  );

  watch(
    () => filters,
    () => {
      updateHash();
      load();
    },
    {
      deep: true,
    }
  );

  load();
  window.addEventListener("hashchange", syncHash);
  onBeforeDestroyed(() => {
    window.removeEventListener("hashchange", syncHash);
  });

  return {
    nextPage: () => {
      page.value += 1;
    },
    prevPage: () => {
      page.value -= 1;
    },
    page,
    filters,
    items,
  };
}
