const { text } = require("body-parser");
const puppeteer = require("puppeteer");
const playerArray = [];


const Guessing = true;
//const TwoFA = true;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createCheckURL(page, browser) {
  return async function checkURL() {
    let current_url = page.url();
    if (current_url === "https://kahoot.it/ranking") {
      await browser.close();
      console.log("Closed");
      process.exit(0);
    }
  };
}

async function start(PIN, NAME, GUESS) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [/*'--no-sandbox', */ "--disable-setuid-sandbox"],
    //defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (['font', 'stylesheet'].includes(request.resourceType())) {
        request.abort();
    } else {
        request.continue();
    }
});

  setInterval(createCheckURL(page, browser), 1000);
  await page.goto("https://kahoot.it/");
  //type code
  try {
    await page.waitForSelector("#game-input", { timeout: 60000 }); // waits for 60 seconds
    const gameInput = await page.$("#game-input");
    if (gameInput) {
      await gameInput.type(PIN);
    }
  } catch (error) {
    console.error("failed");
    console.log(error);
  }
  // clicking
  try {
    await page.waitForSelector("button");
    await page.click("button");
  } catch (error) {
    console.error("failed");
    console.log(error);
  }
  // 2nd page

  try {
    await page.waitForNavigation();

    // Wait for nickname input to be visible
    await page.waitForSelector("#nickname", { visible: true });

    // Type the nickname
    await page.type("#nickname", NAME);

    // Click the button
    await page.click("button");

    // Check for an error message
    try {
      await page.waitForSelector(
        'div[data-functional-selector="notification-bar-error"]',
        { timeout: 5000 }
      );
      const errorMessage = await page.$eval(
        'div[data-functional-selector="notification-bar-text"]',
        (el) => el.textContent
      );

      // If nickname is taken, change it and retry
      if (errorMessage === "Sorry, that nickname is taken.") {
        let alt_Nickname = NAME + "-";

        // Clear the existing value
        await page.evaluate(
          () => (document.querySelector("#nickname").value = "")
        );

        // Type the alternate nickname
        await page.type("#nickname", alt_Nickname);

        // Click the button
        await page.click("button");
      } else {
        console.log("An error occurred: " + errorMessage);
      }
    } catch (error) {
      // We are just ignoring the timeout error here because it is expected
    }
  } catch (error) {
    console.log(error);
  }

  // clicking
  try {
    await page.click("button");
  } catch (error) {
    console.error("failed");
    console.log(error);
  }
  console.debug("Nickname Typed " + NAME);
  await page.waitForNavigation({ timeout: 600000 });
  if (GUESS == true) {
    await page.waitForNavigation();
    var currentQuestion = 0;
    var totalQuestions = 1;
    while (currentQuestion != totalQuestions) {
      const button = await page.$("button");
      if (button) {
        var [currentQuestion, totalQuestions] = await get_question_number(page);
        var answerButtons = await page.$$(
          '[data-functional-selector^="answer-"]'
        );
        let answer = Math.floor(Math.random() * answerButtons.length);

        console.log(NAME + "s guess is " + answer);

        const answerButton = await page.$(
          `button[data-functional-selector="answer-${answer}"]`
        );
        if (answerButton) {
          await answerButton.click();
        }
      }
    }
  }
}

async function get_question_number(page) {
  //gets the number of questions
  var questionCounterText = await page.$eval(
    'div[data-functional-selector="question-index-counter"]',
    (el) => el.textContent
  );

  var parts = questionCounterText.split(" of ");
  var currentQuestion = parseInt(parts[0].trim(), 10);
  var totalQuestions = parseInt(parts[1].trim(), 10);

  // Return an array with two elements
  return [currentQuestion, totalQuestions];
}

module.exports.startKahoot = async function (code, playerName, guessing, AmountOfBots) {
  const Name = playerName;
  if (Name.length >= 13) {
    throw new error("Name has to be lower than 12");
  }

  for (var index = 0; index != AmountOfBots; index++) {
    playerArray.push(Name + index);
  }

  for (let index = 0; index < AmountOfBots; index++) {
    let tempPlayerName = "";
    tempPlayerName = playerArray[index];
    await start(code, tempPlayerName, guessing);
    await wait(2000);
  }
};
