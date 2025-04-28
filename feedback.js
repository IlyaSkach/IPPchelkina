// Вопросы для квиза обратной связи
const defaultQuestions = [
  {
    text: "Выберите услугу, которая Вам требуется:",
    options: [
      "Подготовка документов к аккредитации",
      "Разработка документов системы менеджмента качества",
      "Внедрение системы менеджмента",
      "Подготовка области аккредитации",
      "Обучение сотрудников",
      "Подготовка сотрудников к аккредитации",
      "Анализ опыта работы сотрудников",
      "Проверка деятельности",
      "Проведение аудита",
      "Поиск клиентов",
    ],
  },
  {
    text: "Укажите тип аккредитованного лица:",
    options: ["Орган по сертификации", "Испытательная лаборатория"],
    condition: (answers) => {
      // Показывать этот вопрос только если выбрана услуга с 1 по 8 или услуга 9
      const selectedService = answers[0];
      const services = defaultQuestions[0].options;
      const serviceIndex = services.indexOf(selectedService);
      return serviceIndex >= 0 && serviceIndex < 9;
    },
  },
  {
    text: "Укажите область аккредитации:",
    textInput: true, // признак, что это вопрос с текстовым полем
    condition: (answers) => {
      // Показывать этот вопрос только если выбрана услуга с 1 по 8 или услуга 9
      const selectedService = answers[0];
      const services = defaultQuestions[0].options;
      const serviceIndex = services.indexOf(selectedService);
      return serviceIndex >= 0 && serviceIndex < 9;
    },
  },
  {
    text: "Подтверждение компетентности (срок):",
    options: ["В течение 1 года", "В течение 2 лет", "Каждые 5 лет"],
    condition: (answers) => {
      // Показывать этот вопрос только если выбрана услуга 9 (Проведение аудита)
      const selectedService = answers[0];
      const services = defaultQuestions[0].options;
      return selectedService === "Проведение аудита";
    },
  },
  {
    text: "Укажите сферу бизнеса:",
    textInput: true,
    condition: (answers) => {
      // Показывать этот вопрос только если выбрана услуга 10 (Поиск клиентов)
      const selectedService = answers[0];
      return selectedService === "Поиск клиентов";
    },
  },
  {
    text: "Укажите регион:",
    textInput: true,
    condition: (answers) => {
      // Показывать этот вопрос только если выбрана услуга 10 (Поиск клиентов)
      const selectedService = answers[0];
      return selectedService === "Поиск клиентов";
    },
  },
  {
    text: "Хотите еще что-то добавить?",
    options: ["Да", "Нет"],
    condition: (answers) => {
      // Показывать этот вопрос для всех услуг с 1 по 10
      return true;
    },
  },
  {
    text: "Дополнительная информация:",
    textInput: true,
    condition: (answers) => {
      // Показывать этот вопрос только если ответ на вопрос "Хотите еще что-то добавить?" - "Да"
      if (answers.length < 4) return false;

      const selectedService = answers[0];

      // Определяем индекс ответа на вопрос "Хотите еще что-то добавить?"
      let addMoreAnswerIndex;

      if (selectedService === "Проведение аудита") {
        addMoreAnswerIndex = 4; // У услуги 9 есть дополнительный вопрос о сроке
      } else if (selectedService === "Поиск клиентов") {
        addMoreAnswerIndex = 3; // У услуги 10 есть два текстовых поля (сфера и регион)
      } else {
        addMoreAnswerIndex = 3; // Для услуг 1-8
      }

      const wantsToAddMore = answers[addMoreAnswerIndex] === "Да";
      return wantsToAddMore;
    },
  },
];

let questions = [...defaultQuestions];
let currentQuestion = 1;
let totalQuestions = defaultQuestions.length;
let userAnswers = []; // Массив для хранения ответов пользователя

function startQuiz() {
  document.querySelector(".quiz-start-btn").style.display = "none";

  const chat = document.querySelector(".chat");
  chat.innerHTML = ""; // Очищаем чат при старте
  userAnswers = []; // Очищаем предыдущие ответы

  setTimeout(() => {
    const questionElement = document.createElement("div");
    questionElement.classList.add("chat-message", "operator");
    questionElement.innerHTML = `
      <div class="message-container">
        <div class="operator-avatar">
          <img src="./Images/avatar.gif" alt="avatar">
        </div>
        <div class="message">${questions[0].text}</div>
      </div>
      <div class="options">
        ${questions[0].options
          .map(
            (option) =>
              `<button class="option" onclick="nextQuestion(1, '${option}')">${option}</button>`
          )
          .join("")}
      </div>
    `;
    chat.appendChild(questionElement);

    // Скролл вниз
    const chatContainer = document.querySelector("main");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 1000);
}

function nextQuestion(questionNumber, userAnswer) {
  if (questionNumber !== currentQuestion) {
    console.log(
      `Несоответствие номеров вопросов: текущий ${currentQuestion}, пришел ${questionNumber}`
    );
    return;
  }

  // Скрываем текст приветствия после ответа на первый вопрос
  if (currentQuestion === 1) {
    document.querySelector(".welcome-text").style.display = "none";
  }

  // Сохраняем ответ пользователя
  userAnswers.push(userAnswer);

  const chatContainer = document.querySelector("main");

  // Добавляем ответ пользователя в чат
  const userAnswerMessage = document.createElement("div");
  userAnswerMessage.classList.add("chat-message", "user-answer");
  userAnswerMessage.innerHTML = `
    <div class="message-container">
      <div class="message">${userAnswer}</div>
    </div>
  `;
  document.querySelector(".chat").appendChild(userAnswerMessage);

  // Показываем "печатает..."
  const typingMessage = document.createElement("div");
  typingMessage.classList.add("chat-message", "operator");
  typingMessage.innerHTML = `
    <div class="message-container">
      <div class="operator-avatar">
        <img src="./Images/avatar.gif" alt="avatar">
      </div>
      <div class="message typing">
        Оператор печатает<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
      </div>
    </div>
  `;
  document.querySelector(".chat").appendChild(typingMessage);

  // Фильтруем вопросы на основе условий
  let filteredQuestions = [];
  for (let i = 0; i < defaultQuestions.length; i++) {
    const q = defaultQuestions[i];
    // Первый вопрос всегда включаем
    if (i === 0) {
      filteredQuestions.push(q);
      continue;
    }
    // Если у вопроса нет условия, или условие выполняется, включаем его
    if (!q.condition || q.condition(userAnswers)) {
      filteredQuestions.push(q);
    }
  }

  // Обновляем список вопросов и общее количество
  questions = filteredQuestions;
  totalQuestions = questions.length;

  // Обновляем прогресс-бар
  const progressPercent = (questionNumber / totalQuestions) * 100;
  document.querySelector(".progress").style.width = `${progressPercent}%`;

  // Скролл вниз
  chatContainer.scrollTop = chatContainer.scrollHeight;

  setTimeout(() => {
    typingMessage.remove();

    if (currentQuestion < totalQuestions) {
      const nextQuestionData = questions[currentQuestion];
      const nextQuestionElement = document.createElement("div");
      nextQuestionElement.classList.add("chat-message", "operator");

      if (nextQuestionData.textInput) {
        // Если это вопрос с текстовым полем для ввода
        nextQuestionElement.innerHTML = `
          <div class="message-container">
            <div class="operator-avatar">
              <img src="./Images/avatar.gif" alt="avatar">
            </div>
            <div class="message">
              <p>${nextQuestionData.text}</p>
              <div class="text-input-container">
                <textarea class="text-input" rows="3" placeholder="Введите текст..."></textarea>
                <button class="submit-button text-submit-btn">Отправить</button>
              </div>
            </div>
          </div>
        `;

        // Добавляем элемент в DOM
        document.querySelector(".chat").appendChild(nextQuestionElement);

        // Добавляем обработчик нажатия на кнопку "Отправить"
        const textSubmitBtn =
          nextQuestionElement.querySelector(".text-submit-btn");
        const textInput = nextQuestionElement.querySelector(".text-input");

        textSubmitBtn.addEventListener("click", function () {
          const textValue = textInput.value.trim();

          if (!textValue) {
            showPopup("Пожалуйста, введите ответ");
            return;
          }

          // Отключаем поле ввода и кнопку
          textInput.disabled = true;
          textSubmitBtn.disabled = true;

          // Переходим к следующему вопросу - используем текущий номер вопроса
          // Поскольку currentQuestion уже увеличен, нам не нужно +1
          nextQuestion(currentQuestion, textValue);
        });
      } else {
        // Для обычных вопросов с вариантами ответов
        nextQuestionElement.innerHTML = `
          <div class="message-container">
            <div class="operator-avatar">
              <img src="./Images/avatar.gif" alt="avatar">
            </div>
            <div class="message">${nextQuestionData.text}</div>
          </div>
          <div class="options">
            ${nextQuestionData.options
              .map(
                (option) =>
                  `<button class="option" onclick="nextQuestion(${
                    currentQuestion + 1
                  }, '${option}')">${option}</button>`
              )
              .join("")}
          </div>
        `;

        // Добавляем элемент в DOM
        document.querySelector(".chat").appendChild(nextQuestionElement);
      }

      currentQuestion++;

      // Скролл вниз
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
      // Обновляем прогресс-бар до 100%
      document.querySelector(".progress").style.width = "100%";

      // Форма для контактных данных
      const formElement = document.createElement("div");
      formElement.classList.add("chat-message", "operator");
      formElement.innerHTML = `
        <div class="message-container">
          <div class="operator-avatar">
            <img src="./Images/avatar.gif" alt="avatar">
          </div>
          <div class="message">
            <p>Введите Ваше имя:</p>
            <input type="text" id="user-name" placeholder="Ваше имя">
            <p>Введите Ваш телефон:</p>
            <input type="tel" id="user-phone" placeholder="+7 (999) 999-99-99" maxlength="18" oninput="formatPhoneNumber(this)">
            <p>Введите Ваш E-mail:</p>
            <input type="email" id="user-email" placeholder="Ваш email">
            <div class="agreement-container">
              <input type="checkbox" id="agreement-checkbox">
              <label for="agreement-checkbox">Даю <a href="#" id="open-agreement-modal">согласие на обработку персональных данных</a></label>
            </div>
            <div class="agreement-container">
              <input type="checkbox" id="privacy-policy-checkbox">
              <label for="privacy-policy-checkbox">Нажимая кнопку, вы даете согласие на обработку ваших персональных данных в соответствии с <a href="#" id="open-privacy-policy-modal">Политикой конфиденциальности</a></label>
            </div>
            <button class="submit-button" onclick="submitForm()">Отправить</button>
          </div>
        </div>
      `;
      document.querySelector(".chat").appendChild(formElement);

      // Добавляем обработчики для открытия модальных окон
      setTimeout(() => {
        document
          .getElementById("open-agreement-modal")
          .addEventListener("click", function (e) {
            e.preventDefault();
            showAgreementModal();
          });

        document
          .getElementById("open-privacy-policy-modal")
          .addEventListener("click", function (e) {
            e.preventDefault();
            showPrivacyPolicyModal();
          });
      }, 100);

      // Скролл вниз
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, 1500);
}

function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.startsWith("7")) {
    value = value.slice(1);
  }
  let formattedValue = "+7";
  if (value.length > 0) {
    formattedValue += " (" + value.substring(0, 3);
  }
  if (value.length >= 3) {
    formattedValue += ")";
  }
  if (value.length > 3) {
    formattedValue += " " + value.substring(3, 6);
  }
  if (value.length >= 6) {
    formattedValue += "-";
  }
  if (value.length > 6) {
    formattedValue += value.substring(6, 8);
  }
  if (value.length >= 8) {
    formattedValue += "-";
  }
  if (value.length > 8) {
    formattedValue += value.substring(8, 10);
  }
  input.value = formattedValue.slice(0, 18);
}

function submitForm() {
  const name = document.getElementById("user-name").value;
  const phone = document.getElementById("user-phone").value;
  const email = document.getElementById("user-email").value;
  const agreement = document.getElementById("agreement-checkbox").checked;
  const privacyPolicy = document.getElementById(
    "privacy-policy-checkbox"
  ).checked;
  const phonePattern = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !phonePattern.test(phone) || !emailPattern.test(email)) {
    showPopup("Введите корректное имя, номер телефона и email");
    return;
  }

  if (!agreement) {
    showPopup("Необходимо дать согласие на обработку персональных данных");
    return;
  }

  if (!privacyPolicy) {
    showPopup(
      "Необходимо дать согласие на обработку персональных данных в соответствии с политикой конфиденциальности"
    );
    return;
  }

  // Создаем скрытую форму для отправки данных на сервер
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "send_to_telegram.php";
  form.style.display = "none";

  // Добавляем поля формы
  // Контактные данные
  addHiddenField(form, "name", name);
  addHiddenField(form, "phone", phone);
  addHiddenField(form, "email", email);

  // Добавляем все вопросы и ответы
  let questionIndex = 0;
  for (const answer of userAnswers) {
    if (questionIndex < questions.length) {
      const question = questions[questionIndex].text;
      addHiddenField(form, `question_${questionIndex}`, question);
      addHiddenField(form, `answer_${questionIndex}`, answer);
      questionIndex++;
    }
  }

  // Добавляем количество вопросов
  addHiddenField(form, "question_count", questionIndex);

  // Обработка ответа от сервера
  const iframe = document.createElement("iframe");
  iframe.name = "submit_target";
  iframe.style.display = "none";
  form.target = "submit_target";

  // Отображаем индикатор загрузки
  const submitButton = document.querySelector(".submit-button");
  submitButton.disabled = true;
  submitButton.textContent = "Отправка...";

  // Добавляем элементы в DOM
  document.body.appendChild(form);
  document.body.appendChild(iframe);

  // Обработка события завершения загрузки iframe
  iframe.addEventListener("load", function () {
    submitButton.disabled = false;
    submitButton.textContent = "Отправить";

    const chatContainer = document.querySelector("main");

    // Добавляем сообщение об успешной отправке
    const thankYouMessage = document.createElement("div");
    thankYouMessage.classList.add("chat-message", "operator");
    thankYouMessage.innerHTML = `
      <div class="message-container">
        <div class="operator-avatar">
          <img src="./Images/avatar.gif" alt="avatar">
        </div>
        <div class="message">
          <p>Спасибо за ваши ответы, ${name}!</p>
          <p>Мы свяжемся с вами в ближайшее время по телефону ${phone}</p>
        </div>
      </div>
    `;
    document.querySelector(".chat").appendChild(thankYouMessage);

    // Скролл вниз
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Показываем кнопку начать опрос снова через 3 секунды
    setTimeout(() => {
      // Отображаем кнопку для повторного прохождения квиза
      document.querySelector(".quiz-start-btn").style.display = "block";
      document.querySelector(".quiz-start-btn button").textContent =
        "Пройти опрос еще раз";

      // Сбрасываем состояние квиза
      currentQuestion = 1;
      questions = [...defaultQuestions];
      totalQuestions = defaultQuestions.length;

      // Удаляем форму и iframe
      document.body.removeChild(form);
      document.body.removeChild(iframe);
    }, 3000);
  });

  // Отправляем форму
  form.submit();
}

// Вспомогательная функция для добавления скрытых полей в форму
function addHiddenField(form, name, value) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  form.appendChild(input);
}

function showPopup(message) {
  const popup = document.getElementById("popup");
  document.getElementById("popup-message").textContent = message;
  popup.style.display = "flex";
  // Добавляем небольшую задержку перед добавлением класса show для анимации
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");
  setTimeout(() => {
    popup.style.display = "none";
  }, 300); // Время должно совпадать с длительностью transition в CSS
}

function showAgreementModal() {
  const modal = document.getElementById("agreement-modal");
  modal.style.display = "flex";
  // Добавляем небольшую задержку перед добавлением класса show для анимации
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function closeAgreementModal() {
  const modal = document.getElementById("agreement-modal");
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300); // Время должно совпадать с длительностью transition в CSS
}

function showPrivacyPolicyModal() {
  const modal = document.getElementById("privacy-policy-modal");
  modal.style.display = "flex";
  // Добавляем небольшую задержку перед добавлением класса show для анимации
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function closePrivacyPolicyModal() {
  const modal = document.getElementById("privacy-policy-modal");
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  // Обработчик для кнопки
  const startQuizBtn = document.getElementById("startQuizBtn");
  if (startQuizBtn) {
    startQuizBtn.addEventListener("click", function () {
      questions = [...defaultQuestions];
      totalQuestions = defaultQuestions.length;
      currentQuestion = 1;
      startQuiz();
    });
  }
});
