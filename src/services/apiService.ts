export const fetchDataFromJsonPlaceholder = async () => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${Math.floor(
        Math.random() * 100
      )}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
};
