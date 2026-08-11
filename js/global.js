async function includeHtmlFile(filePath, containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
    }

    // Get the HTML as text
    const htmlText = await response.text();

    // Inject the HTML directly into the container
    container.innerHTML = htmlText;
  } catch (error) {
    console.error("Error loading HTML:", error);
    container.innerHTML = `<p style="color: red;">Error loading content.</p>`;
  }
}

includeHtmlFile("components/navbar.html", "navbar");
