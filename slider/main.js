const flavors = [
  {
    name: ["Chai", "Vanilla"],
    color: "#4A90E2",
    image:
      "https://raw.githubusercontent.com/nidal1111/storage/master/assets/milkshake_banana.png",
    nutrition: ["20g", "13g", "15", "1.8g", "1B"]
  },
  {
    name: ["Maple", "Peanut"],
    color: "#E94B4B",
    image:
      "https://raw.githubusercontent.com/nidal1111/storage/master/assets/milkShake_caffe%CC%80.png",
    nutrition: ["35g", "10g", "10", "1.5g", "2B"]
  },
  {
    name: ["Cacao", "Coconut"],
    color: "#F4D03F",
    image:
      "https://raw.githubusercontent.com/nidal1111/storage/master/assets/milkShake_fragole.png",
    nutrition: ["40g", "25g", "22", "2.2g", "1B"]
  },
  {
    name: ["Berry", "Blend"],
    color: "#8E44AD",
    image:
      "https://raw.githubusercontent.com/nidal1111/storage/master/assets/milkshake_banana.png",
    nutrition: ["28g", "18g", "25", "2.0g", "3B"]
  }
];

let currentIndex = 0;
let isAnimating = false;

const container = document.querySelector(".slider-container");
const overlay = document.querySelector(".color-overlay");
const firstWord = document.querySelector(".first-word");
const secondWord = document.querySelector(".second-word");
const imageElement = document.querySelector(".milkshake-image");
const nutritionValues = document.querySelectorAll(".nutrition-value");
const dots = document.querySelectorAll(".control-dot");

function initSlider() {
  const currentFlavor = flavors[currentIndex];
  container.style.background = currentFlavor.color;
  firstWord.textContent = currentFlavor.name[0];
  secondWord.textContent = currentFlavor.name[1];
  imageElement.src = currentFlavor.image;
}

function morphWords(fromWords, toWords, onComplete) {
  const [fromFirst, fromSecond] = fromWords;
  const [toFirst, toSecond] = toWords;

  firstWord.style.transform = "translateX(0)";
  secondWord.style.transform = "translateX(0)";

  const maxMoveDistance = 20;

  let step = 0;
  const totalSteps = 40;

  function nextFrame() {
    if (step < totalSteps) {
      const progress = step / (totalSteps - 1);
      const easeProgress = progress * progress * progress;

      const moveDistance = maxMoveDistance * easeProgress;
      firstWord.style.transform = `translateX(${moveDistance}px)`;
      secondWord.style.transform = `translateX(-${moveDistance}px)`;

      const firstCharsToShow = Math.max(
        0,
        Math.ceil(fromFirst.length * (1 - easeProgress))
      );
      const secondCharsToShow = Math.max(
        0,
        Math.ceil(fromSecond.length * (1 - easeProgress))
      );

      const currentFirst = fromFirst.substring(0, firstCharsToShow);
      const currentSecond = fromSecond.substring(
        fromSecond.length - secondCharsToShow
      );

      if (currentFirst !== firstWord.textContent) {
        firstWord.textContent = currentFirst;
      }
      if (currentSecond !== secondWord.textContent) {
        secondWord.textContent = currentSecond;
      }

      step++;
      requestAnimationFrame(nextFrame);
    } else {
      setTimeout(() => {
        let expandStep = 0;
        const expandSteps = 40;

        function expandFrame() {
          const expandProgress = expandStep / (expandSteps - 1);
          const easeExpandProgress =
            expandProgress * expandProgress * (3 - 2 * expandProgress);

          const returnDistance = maxMoveDistance * (1 - easeExpandProgress);
          firstWord.style.transform = `translateX(${returnDistance}px)`;
          secondWord.style.transform = `translateX(-${returnDistance}px)`;

          const firstCharsToShow = Math.ceil(
            toFirst.length * easeExpandProgress
          );
          const secondCharsToShow = Math.ceil(
            toSecond.length * easeExpandProgress
          );

          const currentFirst = toFirst.substring(0, firstCharsToShow);
          const currentSecond = toSecond.substring(
            toSecond.length - secondCharsToShow
          );

          if (currentFirst !== firstWord.textContent) {
            firstWord.textContent = currentFirst;
          }
          if (currentSecond !== secondWord.textContent) {
            secondWord.textContent = currentSecond;
          }

          if (expandStep < expandSteps) {
            expandStep++;
            requestAnimationFrame(expandFrame);
          } else {
            firstWord.style.transform = "translateX(0)";
            secondWord.style.transform = "translateX(0)";
            firstWord.textContent = toFirst;
            secondWord.textContent = toSecond;
            if (onComplete) onComplete();
          }
        }

        expandFrame();
      }, 100);
    }
  }

  nextFrame();
}

function animateNutritionValues(newValues) {
  nutritionValues.forEach((value, index) => {
    setTimeout(() => {
      value.style.opacity = "0";
      setTimeout(() => {
        value.textContent = newValues[index];
        value.style.opacity = "1";
      }, 150);
    }, index * 80);
  });
}

function changeSlide(newIndex) {
  if (newIndex === currentIndex || isAnimating) return;

  isAnimating = true;
  const currentFlavor = flavors[currentIndex];
  const newFlavor = flavors[newIndex];

  overlay.style.background = newFlavor.color;
  overlay.classList.add("slide-down");

  setTimeout(() => {
    morphWords(currentFlavor.name, newFlavor.name);
    animateNutritionValues(newFlavor.nutrition);

    setTimeout(() => {
      imageElement.src = newFlavor.image;
      imageElement.style.opacity = "0";

      setTimeout(() => {
        container.style.background = newFlavor.color;
        overlay.classList.remove("slide-down");
        overlay.style.transform = "translateY(-100%)";

        setTimeout(() => {
          imageElement.style.opacity = "1";
          overlay.style.transform = "";
          isAnimating = false;
        }, 300);
      }, 100);
    }, 400);
  }, 0);

  dots[currentIndex].classList.remove("active");
  dots[newIndex].classList.add("active");
  currentIndex = newIndex;
}

function autoSlide() {
  if (!isAnimating) {
    const nextIndex = (currentIndex + 1) % flavors.length;
    changeSlide(nextIndex);
  }
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => changeSlide(index));
});

initSlider();
setInterval(autoSlide, 4000);
