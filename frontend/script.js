const api = 'http://localhost:8000';
let userId = ''; // Ідентифікатор користувача

// Створення нового тамагочі
async function createNewTamagochi(event) {
  event.preventDefault(); // Запобігаємо перезавантаженню сторінки

  const newUserId = document.getElementById('new-user-id').value.trim();
  const tamagochiName = document.getElementById('new-tamagochi-name').value.trim();

  if (!newUserId || !tamagochiName) {
    alert('Будь ласка, введіть UID та ім\'я тамагочі.');
    return;
  }

  try {
    const res = await fetch(`${api}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: newUserId, name: tamagochiName }),
    });

    if (!res.ok) {
      throw new Error('Помилка сервера при створенні тамагочі.');
    }

    const data = await res.json();

    // Перевіряємо, чи повідомлення містить ім'я тамагочі
    if (data.message.includes(tamagochiName)) {
      alert(data.message); // Відображаємо повідомлення сервера

      userId = newUserId;
      document.getElementById('tamagochi-name').innerText = `Привіт, мене звати ${tamagochiName}`;
      document.getElementById('user-id-modal').style.display = 'none'; // Закриваємо модальне вікно
    } else {
      alert('Не вдалося створити тамагочі. Спробуйте ще раз.');
    }
  } catch (error) {
    console.error('Error creating tamagochi:', error);
    alert('Не вдалося створити тамагочі. Спробуйте ще раз.');
  }
}

// Повернення до існуючого тамагочі
async function returnToExistingTamagochi(event) {
  event.preventDefault(); // Запобігаємо перезавантаженню сторінки

  const existingUserId = document.getElementById('existing-user-id').value.trim();

  if (!existingUserId) {
    alert('Будь ласка, введіть UID.');
    return;
  }

  try {
    const res = await fetch(`${api}/status/${existingUserId}`);
    if (!res.ok) throw new Error('Тамагочі з таким UID не знайдено.');

    const data = await res.json();
    userId = existingUserId;
    document.getElementById('tamagochi-name').innerText = `Привіт, мене звати ${data.state.name}`;
    document.getElementById('user-id-modal').style.display = 'none';
    alert('Ви успішно повернулися до свого тамагочі!');
  } catch (error) {
    console.error('Error returning to tamagochi:', error);
    alert('Не вдалося знайти тамагочі. Спробуйте ще раз.');
  }
}

// Універсальна функція для виконання дій (feed/play)
async function performAction(endpoint, successMessage) {
  try {
    changeImageToGif(); // Зміна зображення на гіфку
    const res = await fetch(`${api}/${endpoint}/${userId}`, { method: 'POST' });
    const data = await res.json();
    alert(successMessage || data.message);
    await updateStatusAndFeelings(); // Оновлюємо статус і емоції
    setTimeout(changeImageToJpg, 2000); // Повертаємо зображення через 2 секунди
  } catch (error) {
    console.error(`Error performing action: ${endpoint}`, error);
    alert('Щось пішло не так. Спробуйте ще раз.');
  }
}

// Функція для нагодування
function feed() {
  performAction('feed', 'Тамагочі нагодовано!');
}

// Функція для гри
function play() {
  performAction('play', 'Тамагочі пограв!');
}

async function updateStatusAndFeelings() {
  try {
    if (!userId) {
      console.error('userId не встановлено.');
      alert('Будь ласка, увійдіть або створіть нового тамагочі.');
      return;
    }

    // Оновлюємо статус
    const statusRes = await fetch(`${api}/status/${userId}`);
    if (!statusRes.ok) {
      throw new Error(`Помилка сервера: ${statusRes.status}`);
    }
    const statusData = await statusRes.json();
    document.getElementById('status').innerText = 
      `Ситість: ${statusData.state.satiety}, Щастя: ${statusData.state.happiness}`;

    // Оновлюємо емоції
    const feelingsRes = await fetch(`${api}/feelings/${userId}`);
    if (!feelingsRes.ok) {
      throw new Error(`Помилка сервера: ${feelingsRes.status}`);
    }
    const feelingsData = await feelingsRes.json();
    const emotionDiv = document.getElementById('emotion');

    // Очищаємо попередній текст і класи
    emotionDiv.classList.remove('happy', 'sad');

    // Формуємо повідомлення для користувача
    const { hungry, bored, happy } = feelingsData.feelings;
    let emotionMessage = "";

    if (hungry) {
      emotionMessage = "Я голодний! 😢";
      emotionDiv.classList.add('sad');
    } else if (bored) {
      emotionMessage = "Мені нудно... 😞";
      emotionDiv.classList.add('sad');
    } else if (happy) {
      emotionMessage = "Я щасливий! 😊";
      emotionDiv.classList.add('happy');
    }

    // Оновлюємо DOM
    emotionDiv.innerText = emotionMessage;
  } catch (error) {
    console.error('Error updating status or feelings', error);
    alert('Не вдалося оновити статус або емоції.');
  }
}

// Зміна зображення на гіфку
function changeImageToGif() {
  const img = document.getElementById('tamagochi-image');
  img.src = '/static/assets/tamagotchi_dance.gif'; // Шлях до гіфки
}

// Зміна зображення на світлину
function changeImageToJpg() {
  const img = document.getElementById('tamagochi-image');
  img.src = '/static/assets/tamagotchi.png'; // Шлях до світлини
}

// Переміщення тамагочі в контейнері
function moveTamagochiInContainer() {
  const img = document.getElementById('tamagochi-image');
  const container = document.querySelector('.image-container');
  const containerWidth = container.offsetWidth;
  const imgWidth = img.offsetWidth;

  // Випадковий напрямок (-1 для вліво, 1 для вправо)
  const direction = Math.random() > 0.5 ? 1 : -1;

  const moveDistance = 50 * direction;

  // Поточна позиція
  const currentLeft = parseInt(getComputedStyle(img).left || 0, 10);

  // Нова позиція (з урахуванням меж контейнера)
  let newLeft = currentLeft + moveDistance;
  if (newLeft < 0) newLeft = 0; // Не виходимо за ліву межу
  if (newLeft > containerWidth - imgWidth) newLeft = containerWidth - imgWidth; // Не виходимо за праву межу

  // Віддзеркалення зображення
  img.style.transform = direction === 1 ? 'scaleX(-1)' : 'scaleX(1)';

  // Анімація переміщення
  img.style.transition = 'left 0.8s ease-out';
  img.style.left = `${newLeft}px`;
}

// Викликаємо функцію кожні 2-5 секунд
setInterval(moveTamagochiInContainer, Math.random() * 3000 + 2000);
