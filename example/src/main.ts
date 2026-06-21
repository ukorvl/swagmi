import { runLibraryExample } from ".";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app container");
}

app.innerHTML = `
  <main>
    <h1>typescript-library-template example</h1>
    <p>Status: ${runLibraryExample()}</p>
    <p>Library import resolves through the package name.</p>
  </main>
`;
