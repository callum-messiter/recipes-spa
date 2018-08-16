<template>
  <div id="app">
    <div class="container-fluid">
      <router-view/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: { },

  created() { },

  computed: { }
}
</script>

<style>
  #app {
    font-family: Helvetica, 'Avenir', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    padding-top: 20px;
  }
</style>
