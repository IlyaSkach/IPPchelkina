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
