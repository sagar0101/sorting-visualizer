// Selecting important elements
const barsContainer = document.getElementById("bars");
const workingDiv = document.getElementById("working");
const generateInputButton = document.getElementById("generateInputButton");
const generateRandomButton = document.getElementById("generateRandomButton");
const bubbleSortButton = document.getElementById("bubbleSortButton");
const selectionSortButton = document.getElementById("selectionSortButton");
const speedInput = document.getElementById("speed");
const inputValues = document.getElementById("inputValues");

// Array to hold the bars
let bars = [];

// Function to clear the bars
function clearBars() {
  barsContainer.innerHTML = ""; // Clears the bars displayed
  bars.length = 0; // Resets the bars array
}

// Function to generate bars from user input
function generateBarsFromInput() {
  clearBars(); // Clear existing bars first
  // Get the values from the input field and convert them to an array of integers
  const values = inputValues.value
    .split(",")
    .map((num) => parseInt(num.trim()))
    .filter((num) => !isNaN(num)); // Filters out invalid entries
  if (values.length === 0) {
    alert("Enter valid numbers!"); // Alerts if no valid numbers are entered
    return;
  }
  createBars(values); // Create bars with the values
}

// Function to generate random bars
function generateRandomBars() {
  clearBars(); // Clears any existing bars
  const values = Array.from(
    { length: 10 },
    () => Math.floor(Math.random() * 100) + 1
  ); // Generate 10 random values
  createBars(values); // Create bars with random values
}

// Function to create bars based on values
function createBars(values) {
  values.forEach((value) => {
    const bar = document.createElement("div"); // Create a new div for each bar
    bar.classList.add("bar"); // Add the 'bar' class for styling
    bar.style.height = `${value * 3}px`; // Set the height of the bar
    bar.textContent = value; // Set the number inside the bar
    bars.push(bar); // Add the bar to the bars array
    barsContainer.appendChild(bar); // Add the bar to the container
  });
}

// ====== Bubble Sort Algorithm ======
async function bubbleSort() {
  disableAllButtons(); // Disable buttons while sorting
  workingDiv.textContent =
    "Bubble Sort: Comparing and swapping adjacent elements."; // Show working status
  // Bubble Sort logic
  for (let i = 0; i < bars.length - 1; i++) {
    for (let j = 0; j < bars.length - i - 1; j++) {
      bars[j].style.backgroundColor = "red"; // Highlight the bars being compared
      bars[j + 1].style.backgroundColor = "red";

      await wait(speedInput.value); // Wait before proceeding to the next comparison

      if (parseInt(bars[j].textContent) > parseInt(bars[j + 1].textContent)) {
        swapBars(j, j + 1); // Swap bars if they are out of order
      }

      // Reset bar colors
      bars[j].style.backgroundColor = "#f39c12";
      bars[j + 1].style.backgroundColor = "#f39c12";
    }
  }
  workingDiv.textContent = "Bubble Sort completed!"; // Show completion message
  enableAllButtons(); // Re-enable the buttons after sorting
  updateTable("Bubble Sort"); // Update the comparison table with results
}

// ====== Selection Sort Algorithm ======
async function selectionSort() {
  disableAllButtons(); // Disable buttons while sorting
  workingDiv.textContent =
    "Selection Sort: Selecting the smallest element and swapping."; // Show working status
  // Selection Sort logic
  for (let i = 0; i < bars.length; i++) {
    let minIndex = i; // Initially assume the first element is the minimum
    bars[minIndex].style.backgroundColor = "red"; // Highlight the current minimum

    for (let j = i + 1; j < bars.length; j++) {
      bars[j].style.backgroundColor = "blue"; // Highlight the element being compared

      await wait(speedInput.value); // Wait before proceeding to the next comparison

      if (
        parseInt(bars[j].textContent) < parseInt(bars[minIndex].textContent)
      ) {
        bars[minIndex].style.backgroundColor = "#f39c12"; // Reset previous minimum color
        minIndex = j; // Update the minimum index
        bars[minIndex].style.backgroundColor = "red"; // Highlight new minimum
      } else {
        bars[j].style.backgroundColor = "#f39c12"; // Reset color if no swap
      }
    }

    if (minIndex !== i) {
      swapBars(i, minIndex); // Swap the minimum element with the current element
    }
    bars[minIndex].style.backgroundColor = "#f39c12"; // Reset the minimum element color
  }
  workingDiv.textContent = "Selection Sort completed!"; // Show completion message
  enableAllButtons(); // Re-enable the buttons after sorting
  updateTable("Selection Sort"); // Update the comparison table with results
}
// ====== Quick Sort Algorithm ======
async function quickSort(start = 0, end = bars.length - 1) {
  if (start >= end) return;

  disableAllButtons(); // Disable buttons while sorting
  workingDiv.textContent = "Quick Sort: Partitioning and sorting subarrays."; // Show working status

  let pivotIndex = await partition(start, end); // Get the pivot index after partitioning

  await quickSort(start, pivotIndex - 1); // Recursively sort the left subarray
  await quickSort(pivotIndex + 1, end); // Recursively sort the right subarray

  if (start === 0 && end === bars.length - 1) {
    workingDiv.textContent = "Quick Sort completed!"; // Show completion message
    enableAllButtons(); // Re-enable the buttons after sorting
    updateTable("Quick Sort"); // Update the comparison table with results
  }
}

async function partition(start, end) {
  let pivotValue = parseInt(bars[end].textContent); // Choose the last element as pivot
  bars[end].style.backgroundColor = "green"; // Highlight pivot bar

  let pivotIndex = start;
  for (let i = start; i < end; i++) {
    bars[i].style.backgroundColor = "blue"; // Highlight current bar

    await wait(speedInput.value); // Wait before proceeding to the next comparison

    if (parseInt(bars[i].textContent) < pivotValue) {
      swapBars(i, pivotIndex); // Swap elements
      pivotIndex++;
    }
    bars[i].style.backgroundColor = "#f39c12"; // Reset bar color
  }
  swapBars(pivotIndex, end); // Place pivot in correct position
  bars[end].style.backgroundColor = "#f39c12"; // Reset pivot color
  return pivotIndex;
}

// ====== Merge Sort Algorithm ======
async function mergeSort(start = 0, end = bars.length - 1) {
  if (start >= end) return;

  disableAllButtons(); // Disable buttons while sorting
  workingDiv.textContent = "Merge Sort: Dividing and merging subarrays."; // Show working status

  let mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid); // Recursively sort the left half
  await mergeSort(mid + 1, end); // Recursively sort the right half
  await merge(start, mid, end); // Merge the sorted halves

  if (start === 0 && end === bars.length - 1) {
    workingDiv.textContent = "Merge Sort completed!"; // Show completion message
    enableAllButtons(); // Re-enable the buttons after sorting
    updateTable("Merge Sort"); // Update the comparison table with results
  }
}

async function merge(start, mid, end) {
  let temp = [];
  let i = start,
    j = mid + 1;

  while (i <= mid && j <= end) {
    bars[i].style.backgroundColor = "blue";
    bars[j].style.backgroundColor = "blue";

    await wait(speedInput.value);

    if (parseInt(bars[i].textContent) < parseInt(bars[j].textContent)) {
      temp.push(parseInt(bars[i].textContent));
      bars[i].style.backgroundColor = "#f39c12";
      i++;
    } else {
      temp.push(parseInt(bars[j].textContent));
      bars[j].style.backgroundColor = "#f39c12";
      j++;
    }
  }
  while (i <= mid) {
    temp.push(parseInt(bars[i++].textContent));
  }
  while (j <= end) {
    temp.push(parseInt(bars[j++].textContent));
  }
  for (let k = start; k <= end; k++) {
    bars[k].textContent = temp[k - start];
    bars[k].style.height = `${temp[k - start] * 3}px`;
    await wait(speedInput.value);
  }
}

// ====== Heap Sort Algorithm ======
async function heapSort() {
  disableAllButtons(); // Disable buttons while sorting
  workingDiv.textContent =
    "Heap Sort: Building a max heap and extracting elements."; // Show working status

  for (let i = Math.floor(bars.length / 2) - 1; i >= 0; i--) {
    await heapify(bars.length, i);
  }

  for (let i = bars.length - 1; i > 0; i--) {
    swapBars(0, i); // Move current root to the end
    await heapify(i, 0); // Call heapify on the reduced heap
  }

  workingDiv.textContent = "Heap Sort completed!"; // Show completion message
  enableAllButtons(); // Re-enable the buttons after sorting
  updateTable("Heap Sort"); // Update the comparison table with results
}

async function heapify(size, root) {
  let largest = root;
  let left = 2 * root + 1;
  let right = 2 * root + 2;

  if (
    left < size &&
    parseInt(bars[left].textContent) > parseInt(bars[largest].textContent)
  ) {
    largest = left;
  }
  if (
    right < size &&
    parseInt(bars[right].textContent) > parseInt(bars[largest].textContent)
  ) {
    largest = right;
  }
  if (largest !== root) {
    swapBars(root, largest);
    await wait(speedInput.value);
    await heapify(size, largest);
  }
}

// Swap Bars Function
function swapBars(index1, index2) {
  const tempHeight = bars[index1].style.height; // Save the height of the first bar
  const tempText = bars[index1].textContent; // Save the text of the first bar

  // Swap the height and text of the two bars
  bars[index1].style.height = bars[index2].style.height;
  bars[index1].textContent = bars[index2].textContent;

  bars[index2].style.height = tempHeight;
  bars[index2].textContent = tempText;
}

// Wait Function for delay
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms)); // Returns a promise that resolves after a delay
}

// Disable all buttons
function disableAllButtons() {
  generateInputButton.disabled = true;
  generateRandomButton.disabled = true;
  bubbleSortButton.disabled = true;
  selectionSortButton.disabled = true;
  heapSortButton.disabled = true;
  mergeSortButton.disabled = true;
  quickSortButton.disabled = true;
}

// Enable all buttons
function enableAllButtons() {
  generateInputButton.disabled = false;
  generateRandomButton.disabled = false;
  bubbleSortButton.disabled = false;
  selectionSortButton.disabled = false;
  heapSortButton.disabled = false;
  mergeSortButton.disabled = false;
  quickSortButton.disabled = false;
}

// ====== Update the comparison table ======
function updateTable(algorithm) {
  const tbody = document.querySelector("#comparisonTable tbody");
  tbody.innerHTML = ""; // Clear the existing table rows
  let row;
  if (algorithm === "Bubble Sort") {
    row = `
          <tr>
            <td>Bubble Sort</td>
            <td>O(n)</td>
            <td>O(n^2)</td>
            <td>O(n^2)</td>
            <td>O(1)</td>
            <td>Yes</td>
          </tr>
        `;
  } else if (algorithm === "Selection Sort") {
    row = `
          <tr>
            <td>Selection Sort</td>
            <td>O(n^2)</td>
            <td>O(n^2)</td>
            <td>O(n^2)</td>
            <td>O(1)</td>
            <td>No</td>
          </tr>
        `;
  } else if (algorithm === "Quick Sort") {
    row = `
          <tr>
            <td>Quick Sort</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n^2)</td>
            <td>O(log n)</td>
            <td>No</td>
          </tr>
        `;
  } else if (algorithm === "Merge Sort") {
    row = `
          <tr>
            <td>Merge Sort</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n)</td>
            <td>Yes</td>
          </tr>
        `;
  } else if (algorithm === "Heap Sort") {
    row = `
          <tr>
            <td>Heap Sort</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(1)</td>
            <td>No</td>
          </tr>
        `;
  }

  tbody.innerHTML = row; // Insert the new row into the table
}

// ====== Event Listeners ======
generateInputButton.addEventListener("click", generateBarsFromInput);
generateRandomButton.addEventListener("click", generateRandomBars);
bubbleSortButton.addEventListener("click", bubbleSort);
selectionSortButton.addEventListener("click", selectionSort);
document
  .getElementById("quickSortButton")
  .addEventListener("click", () => quickSort());
document
  .getElementById("mergeSortButton")
  .addEventListener("click", () => mergeSort());
document
  .getElementById("heapSortButton")
  .addEventListener("click", () => heapSort());
