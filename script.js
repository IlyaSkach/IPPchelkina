// Глобальные функции для сайта
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const mobileMenuButton = document.querySelector(".mobile-menu-button");
  const mainNav = document.querySelector(".main-nav");
  const contactInfo = document.querySelector(".contact-info");

  // Функция для мобильного меню
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenuButton.classList.toggle("open");
      mainNav.classList.toggle("open");
      contactInfo.classList.toggle("open");
    });
  }

  // Закрытие мобильного меню при клике на ссылку
  document.querySelectorAll(".menu a").forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 992) {
        mobileMenuButton.classList.remove("open");
        mainNav.classList.remove("open");
        contactInfo.classList.remove("open");
      }
    });
  });

  // Плавный скролл для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - header.offsetHeight,
          behavior: "smooth",
        });
      }
    });
  });
});

const documents = [
  {
    name: "Приказ от 09.01.2020 N 1",
    path: "document/Приказ от 09_01_2020 N 1 О формах сведений о соответствии аккредитованных в национальной системе..._Текст.pdf",
  },
  {
    name: "Об утверждении Положения",
    path: "document/Об утверждении Положения о составе сведений о результатах деятельности аккредитованных лиц, об..._Текст редакции (1).pdf",
  },
  {
    name: "Закон от 28.12.2013 N 412-ФЗ",
    path: "document/Закон от 28_12_2013 N 412-ФЗ Об аккредитации в национальной системе аккредитации (с изменениями на..._Текст.pdf",
  },
  {
    name: "ГОСТ Р ИСОМЭК 17065-2012",
    path: "document/ГОСТ Р ИСОМЭК 17065-2012 Оценка соответствия. Требования к органам по сертификации продукции,..._Текст.pdf",
  },
  {
    name: "ГОСТ ISOIEC 17025-2019",
    path: "document/ГОСТ ISOIEC 17025-2019 Общие требования к компетентности испытательных и калибровочных лабораторий..._Текст.pdf",
  },
  {
    name: "Решение от 05.12.2018 N 100",
    path: "document/Решение от 05_12_2018 N 100 О Порядке включения аккредитованных органов по оценке соответствия (в..._Текст.pdf",
  },
  {
    name: "Приказ от 26.10.2020 N 707",
    path: "document/Приказ от 26_10_2020 N 707 Об утверждении критериев аккредитации и перечня документов,..._Текст.pdf",
  },
  {
    name: "Приказ от 25.01.2019 N 11",
    path: "document/Приказ от 25_01_2019 N 11 Об утверждении методических рекомендаций по описанию области аккредитации..._Текст.pdf",
  },
  {
    name: "Приказ от 16.08.2021 N 496",
    path: "document/Приказ от 16_08_2021 N 496 Об утверждении форм заявления об аккредитации, заявления о расширении..._Текст.pdf",
  },
  {
    name: "Приказ от 13.06.2019 N 106",
    name: "Приказ от 13_06_2019 N 106 Об утверждении методических рекомендаций по описанию области..._Текст.pdf",
  },
];

function createDocumentElements() {
  const container = document.querySelector(".documents-container");
  if (!container) return;

  documents.forEach((doc) => {
    const item = document.createElement("div");
    item.className = "document-item";

    item.innerHTML = `
            <div class="document-icon">
                <div class="document-front">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="document-back">
                    <i class="fas fa-download"></i>
                </div>
            </div>
            <div class="document-title">${doc.name}</div>
        `;

    item.addEventListener("click", () => {
      window.open(doc.path, "_blank");
    });

    container.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", createDocumentElements);

function handleExperienceBadge() {
  const experienceBadge = document.querySelector(".experience-badge");
  const aboutHeader = document.querySelector(".about-header");
  if (!experienceBadge || !aboutHeader) return;

  // Проверяем, не мобильная ли версия
  if (window.innerWidth <= 992) return;

  const headerRect = aboutHeader.getBoundingClientRect();
  const scrollPosition = window.scrollY;

  if (scrollPosition > headerRect.top) {
    experienceBadge.style.position = "fixed";
    experienceBadge.style.top = "20px";
    experienceBadge.style.left = "20px";
  } else {
    experienceBadge.style.position = "absolute";
    experienceBadge.style.top = "0";
    experienceBadge.style.left = "0";
  }
}

window.addEventListener("scroll", handleExperienceBadge);
window.addEventListener("load", handleExperienceBadge);
window.addEventListener("resize", handleExperienceBadge);
