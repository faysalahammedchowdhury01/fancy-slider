// global variables
const imagesContainer = document.getElementById('images-container');
const sliderContainer = document.getElementById('slider-container');
const createSliderBtn = document.getElementById('create-slide-btn');
const indicators = document.getElementById('indicators');

// selected images
let selectedImages = [];
let activeSlideIndex = 0;
let timer;

// load image from pixabay api
const loadImages = async (category) => {
  // https://pixabay.com/api/?key=21525805-2df30f43a034b564c54907ba0&q=yellow+flowers
  const API_KEY = '21525805-2df30f43a034b564c54907';
  const url = `https://pixabay.com/api/?key=${API_KEY}ba0&q=${category}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const images = await data.hits;
    return images;
  } catch (error) {
    alert(error);
  }
};

// selected image
const selectedImage = (event, image) => {
  // get element
  const element = event.target;

  // check if image exist
  const index = selectedImages.indexOf(image);
  const isImageExist = index === -1 ? false : true;

  if (isImageExist) {
    selectedImages.splice(index, 1);
    element.className = 'cursor-pointer';
  } else {
    element.className = 'cursor-pointer border border-2 p-1';
    selectedImages.push(image);
  }
};

// display images
const displayImages = (images) => {
  // check image found or not
  if (images.length === 0) {
    alert('Image not found!!');
    return;
  }

  // if image found then set inner html
  imagesContainer.innerHTML = images
    .map((image) => {
      return `
      <div onclick="selectedImage(event,'${image.webformatURL}')">
        <img class="cursor-pointer" src="${image.webformatURL}" />
      </div>
      `;
    })
    .join('');
};

// handle smage search
const handleImageSearch = async (event) => {
  event.preventDefault();

  // get search image input
  const searchImageInput = document.getElementById('search-image-input');
  const searchImageInputVal = searchImageInput.value.trim();

  // if search value is blank
  if (searchImageInputVal === '') {
    alert("Search input can't be blank");
    return;
  }

  // clear selected image
  selectedImages = [];

  // get images
  const images = await loadImages(searchImageInputVal);

  // display images
  displayImages(images);

  // show create slide button
  createSliderBtn.classList.remove('hidden');

  // hide indicators button and slider
  sliderContainer.innerHTML = '';
  indicators.classList.add('hidden');

  // clear search input and timer
  searchImageInput.value = '';
  clearInterval(timer);
};

// create slide
const createSlide = () => {
  console.log(selectedImages);
  // selected image length must be or greater than two
  if (selectedImages.length < 2) {
    alert('Please select at least two image!');
    return;
  }

  // hide image and create slider button
  imagesContainer.innerHTML = '';
  createSliderBtn.classList.add('hidden');

  // show indicators button
  indicators.classList.remove('hidden');

  // add slider
  sliderContainer.innerHTML = selectedImages
    .map((image) => {
      return `
      <img class="slider-item transition-all absolute  top-0 left-0 w-full opacity-0 invisible" src="${image}"/>
      `;
    })
    .join('');

  changeSlide(activeSlideIndex);
  startTimer();
};

const startTimer = () => {
  return (timer = setInterval(() => {
    activeSlideIndex++;
    if (activeSlideIndex === selectedImages.length) activeSlideIndex = 0;
    changeSlide(activeSlideIndex);
  }, 6000));
};

const chnageItem = (changeIndex) => {
  activeSlideIndex = activeSlideIndex + changeIndex;
  if (activeSlideIndex < 0) {
    activeSlideIndex = selectedImages.length - 1;
  }
  if (activeSlideIndex >= selectedImages.length) {
    activeSlideIndex = 0;
  }
  changeSlide(activeSlideIndex);
  clearInterval(timer);
  startTimer();
};

const changeSlide = (index) => {
  const sliderItems = document.getElementsByClassName('slider-item');
  // hide all image
  for (const item of sliderItems) {
    item.classList.add('opacity-0');
    item.classList.add('invisible');
  }
  sliderItems[index].classList.remove('opacity-0');
  sliderItems[index].classList.remove('invisible');
};

// search submit event
document
  .getElementById('search-image-form')
  .addEventListener('submit', handleImageSearch);

// create slide event
createSliderBtn.addEventListener('click', createSlide);
