<template>
  <div>
    <label
      >Category:
      <select v-model="filters.categories">
        <option v-for="category in availableCategories" :value="category.id">{{ category.name }}</option>
      </select>
    </label>
    <hr />
    <div>
      <button :disabled="page.value === 1" @click="prevPage">Prev</button>
      {{ page.value }}
      <button @click="nextPage">Next</button>
    </div>
    <hr />

    <ul>
      <li v-for="item in items.value">
        <a target="_blank" :href="item.link" v-html="item.title.rendered"></a>
      </li>
    </ul>
  </div>
</template>
<script>
import { getPosts, getCategories } from "../api/techcrunch";
import { useFilterable } from "./use/filterable";

export default {
  data() {
    return {
      categories: [],
    };
  },
  computed: {
    availableCategories() {
      return [{ id: null, name: "(no category)" }, ...this.categories];
    },
  },
  methods: {
    async loadCategories() {
      this.categories = await getCategories();
    },
  },

  setup() {
    const { page, filters, items, prevPage, nextPage } = useFilterable({
      loadItems: getPosts,
      initialFilters: {
        categories: null,
      },
    });

    return {
      page,
      filters,
      items,
      prevPage,
      nextPage,
    };
  },

  created() {
    this.loadCategories();
  },
};
</script>
1
