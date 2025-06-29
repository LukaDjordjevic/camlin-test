<template>
  <div class="table-container">
    <h2>Vue3 Transformers App</h2>
    <h3>Introduction</h3>
    <p>
      This is a Vue3 app that displays various transformers data. The data is displayed in a table
      listing available transformers. Last 10 voltage measurements are displayed in a graph for each
      transformer.
    </p>
    <h3>Tech Stack</h3>
    <p>
      The data is served by a tiny node Express server. Fetching is done via vue-query to ensure
      caching. Pinia is used for state management (only dark mode store) and vue-router for routing.
      Plotly.js is used for rendering graphs.
    </p>
    <h3>Features</h3>
    <ul>
      <li>
        The app displays a transformers table and a graph with voltage data for each selected
        transformer
      </li>
      <li>
        The table shows transformer name, health and region. It also provides a checkboxes that
        control whether transformer data is shown in a graph
      </li>

      <li>
        You can filter transformers by searching by transformer name. You can also filter by region
        and transformer health. Multiple region and health filters are allowed
      </li>
      <li>
        Search query, region/health filters and table visibility data are all persisted in local
        storage
      </li>
      <li>
        The app will be shown in dark or light mode based on system preferences. The app will also
        react to system theme change
      </li>
    </ul>
    <h3>Time to complete the task</h3>
    <p>Over a weekend binge</p>
    <h3>Contact</h3>
    <p>lulo.djordjevic@gmail.com</p>
  </div>
</template>

<style scoped>
h2 {
  font-weight: bold;
}
p,
li {
  font-size: 16px;
}
h3 {
  font-weight: bold;
  font-size: 20px;
  margin-top: 24px;
}
</style>
