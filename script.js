window.onload = () => {
  
  let tasks = [];
  
  const content = document.querySelector('.content');
  const inputQuestion = document.querySelector('.input-question');
  const inputAnswer = document.querySelector('.input-answer');
  const modal = document.querySelector('.modal-title');
  
  window.addEventListener('click', event => {
    // jika element yang ditekan memiliki class "btn-modal"
    if (event.target.classList.contains('btn-modal')) {
      // ambil isi atribut "data-type" dari element yang ditekan
      const type = event.target.dataset.type;
      // jadikan isi variabel "type" sebagai judul modal 
      modal.textContent = `modal ${type} data`;
      // jika judul modal bertuliskan kata "add" maka bersihkan value input
      if (modal.textContent.includes('add')) clear();
    }
  });
  
  function clear() {
    // bersihkan value input
    inputQuestion.value = '';
    inputAnswer.value = '';
  }
  
  // ketika tombol submit djtekan, jalankan fungsi addData()
  const btnSubmit = document.querySelector('.btn-submit');
  btnSubmit.addEventListener('click', addData);
  
  function addData() {
    // jika judul modal bertuliskan kata "add"
    if (modal.textContent.includes('add')) {
      // value input 
      const question = inputQuestion.value.trim();
      const answer = inputAnswer.value.trim();
      // validasi input terlebih dahulu
      if (validate(question, answer) == true) {
        // jadikan value input sebagai objek
        const data = {question: question, answer: answer};
        // simpan isi variabel "data" kedalam array
        tasks.unshift(data);
        // simpan kedalam localstorage
        saveToLocalStorage();
        // tampilkan element ke halaman depan
        updateUI(data);
        // beri pesan bahwa "data berhasil ditanbahkan"
        alerts('success', 'Data has been added!');
        // load data yang sudah tersimpan didalam localstorage
        loadData();
        // bersihkan value input
        clear();
      }
    }
  }
  
  function validate(question, answer) {
    // jika semua input kosong
    if (!question && !answer) return alerts('error', 'field`s was empty!');
    // jika input "question" kosong
    if (!question) return alerts('error', 'field question was empty!');
    // jika input "answer" kosong
    if (!answer) return alerts('error', 'field answer was empty!');
    // jika isi input "question" terlalu pendek
    if (question.length < 3) return alerts('error', 'field question must be more then 3 character!');
    // jika berhasil melewati semua validasi
    return true;
  }
  
  function saveToLocalStorage() {
    /*
      simpan isi variabel "tasks" kedalam localstorage. setelah itu, isi variabel
      "tasks" akan diparsing menjadi string JSON
    */
    localStorage.setItem('flashcard-app', JSON.stringify(tasks));
  }
  
  function updateUI(data, index) {
    // render element
    const result = showUI(data, index);
    // tampilkan element ke halaman depan
    content.insertAdjacentHTML('beforeend', result);
  }
  
  function showUI({question, answer}, index) {
    return `
    <div class="col-md-6">
      <div class="box shadow rounded-0 my-2">
        <h6 class="fw-normal my-auto">${question}</h6>
        <button class="btn btn-primary rounded-0 btn-show-hide w-100 my-3">
          show/hide answer
        </button>
        <div class="box-content mb-3">
          <p class="fw-light text-black-500 my-auto">
            ${answer}
          </p>
        </div>
        <div class="d-flex justify-content-center align-items-center mx-auto">
          <a
            href="#"
            class="btn btn-success btn-sm rounded-0 btn-edit btn-modal"
            data-type="edit"
            data-id="${index}"
            data-bs-toggle="modal"
            data-bs-target="#modalBox">
            <i class="fa-solid fa-pen me-1"></i>
            edit
          </a>
          <div class="mx-2"></div>
          <a 
            href="#" 
            data-id="${index}"
            class="btn btn-danger btn-sm rounded-0 btn-delete">
            <i class="fa-solid fa-trash-alt me-1"></i>
            delete
          </a>
        </div>
      </div>
    </div>
    `;
  }
  
  // tampilkan atau sembunyikan element "box-content"
  window.addEventListener('click', event => {
    // jika element yang ditekan memiliki class "btn-show-hide"
    if (event.target.classList.contains('btn-show-hide')) {
      // dapatkan element "box-content" dan berikan class "active" pada element tersebut
      const boxContent = event.target.nextElementSibling;
      boxContent.classList.toggle('active');
    }
  });
  
  function alerts(type, text) {
    // plugin dari "sweetalert2"
    swal.fire ({
      icon: type,
      title: 'Alert',
      text: text
    });
  }
  
  function loadData() {
    // bersihkan isi element "content"
    content.innerHTML = '';
    // ambil data yang sudah tersimpan didalam localstorage
    const data = localStorage.getItem('flashcard-app');
    /*
      jika variabel "data" menghasilkan boolean "trye", maka ubah isi variabel 
      "tasks" dengan data yang sudsh diparsing menjadi JSON. jika variabel "data" menghasilkan
      boolean "false", maka ubah isi variabel "tasks" dengan array kosong.
    */
    tasks = (data) ? JSON.parse(data) : [];
    /*
      looping variabel "tasks" dan jalankan fungsi updateUI() untuk menampilkan
      element yang sudah dirender ke halaman depan.
    */
    tasks.forEach((task, index) => updateUI(task, index));
  }
  
  loadData();
  
  // edit data 
  window.addEventListener('click', event => {
    // jika element yang ditekan memiliki class "btn-edit"
    if (event.target.classList.contains('btn-edit')) {
      // mematikan fungsi dari atribut 'href=""'
      event.preventDefault();
      // dapatkan isi atribut "data-id" pada element yang ditekan
      const index = event.target.dataset.id;
      // set value input dengan isi array dengan index dari variabel "index"
      setValueInput(index);
      // jalankan fungsi editData()
      editData(index);
    }
  });
  
  function setValueInput(index) {
    // set isi array dengan index dari parameter "index"
    inputQuestion.value = tasks[index].question;
    inputAnswer.value = tasks[index].answer;
  }
  
  function editData(index) {
    // ketika tombol submit ditekan
    btnSubmit.addEventListener('click', () => {
      // cek judul modal apakah bertuliskan kata "edit"
      if (modal.textContent.includes('edit')) {
        // value input 
        const question = inputQuestion.value.trim();
        const answer = inputAnswer.value.trim();
        // validasi input lebih dahulu
        if (validate(question, answer) == true) {
          // ubah isi array dengan index dari paramter "index" dengan value input
          tasks[index].question = question;
          tasks[index].answer = answer;
          // simpan perubahannya kedalam localstorage
          saveToLocalStorage();
          // beri pesan bahwa "data berhasil diubah atau diedit"
          alerts('success', 'Data has been updated!');
          /*
            jadikan variabel "tasks" dan parameter "index" sebagai "null" guna
            mencegah adanya data yang terduplikat
          */
          tasks = null;
          index = null;
          // load data yang sudah disimpan kedalam localstorage
          loadData();
        }
      }
    });
  }
  
  // hapus data 
  window.addEventListener('click', event => {
    // jika element yang ditekan memiliki class "btn-delete" 
    if (event.target.classList.contains('btn-delete')) {
      // mematikan fungsi dari atribut 'href=""'
      event.preventDefault();
      // dapatkan isi atribut "data-id" pada element yang ditekan
      const index = event.target.dataset.id;
      // jalankan fungsi deleteData()
      deleteData(index);
    }
  });
  
  function deleteData(index) {
    // plugin dari "sweetalert2"
    swal.fire ({
      icon: 'info',
      title: 'are you sure?',
      text: 'do you want to delete this data?',
      showCancelButton: true
    })
    .then(response => {
      // jika tombol "ok" atau "yes" yang ditekan
      if (response.isConfirmed) {
        // hapus array dengan index dari parameter "index"
        tasks.splice(index, 1);
        // simpan perubahannya kedalam localstorage
        saveToLocalStorage();
        // beri pesan bahwa "data berhasil dihapus"
        alerts('success', 'Data has been deleted!');
        // load data yang sudah disimpan kedalam localstorage
        loadData();
      }
    })
  } 
  
  // pencarian data
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('keyup', function() {
    // value 
    const value = this.value.trim();
    // konversikan "Nodelist" menjadi "array" supaya bisa dilooping
    const result = Array.from(content.children);
    result.forEach(data => {
      // data string 
      const string = data.textContent.toLowerCase();
      // tampilkan data yang serupa dengan isi "input pencarian"
      data.style.display = (string.indexOf(value) != -1) ? '' : 'none';
    });
  });
  
}