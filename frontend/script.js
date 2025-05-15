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