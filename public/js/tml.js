import { convertLevel } from '../../utils/helpers.js';
import TaskModel from '../../models/task.js';

const sortTypeData = [
  {
    sortBy: 'title',
    orderBy: 'asc',
  },
  {
    sortBy: 'title',
    orderBy: 'desc',
  },
  {
    sortBy: 'level',
    orderBy: 'asc',
  },
  {
    sortBy: 'level',
    orderBy: 'desc',
  },
];

init();

function init() {
  const $searchInput = document.getElementById('search-task-input');
  const $sortSelect  = document.getElementById('sort-select');
  const $mainContent = document.getElementById('main-content');
  const $imageNotFound = document.getElementById('not-found');
  const $table = document.getElementById('tasks-content');
  const $sortValue = document.getElementById('sort-value');
  const $btnToggle = document.getElementById('btn-toggle');
  const $mainForm = document.getElementById('form-main');
  const LOCAL_STORAGE_TASK_LIST = 'taskLists';

  const taskInLocalStore = localStorage.getItem(LOCAL_STORAGE_TASK_LIST)
                            ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_LIST))
                            : [];

  let Tasks = taskInLocalStore;

  renderTasks(Tasks);
  renderSortList(sortTypeData);

  let __isShowForm = false;
  let __searchString = '';
  let __sortData = {
    sortBy: 'title',
    orderBy: 'asc'
  };
  let __taskTarget = null;

  $searchInput.addEventListener('input', search);
  $sortSelect.addEventListener('change', sort);
  $btnToggle.addEventListener('click', toggleForm);
  $mainForm.addEventListener('submit', submitForm);

  function submitForm(e) {
    const $taskName = document.getElementById('task-name-value');
    const $taskLevel = document.getElementById('task-level-value');
    const taskNameValue = $taskName.value;
    const taskLevelValue = parseInt($taskLevel.value);

    e.preventDefault();
    if (__taskTarget === null) {
      // Handle create new
      if (taskNameValue.length <= 0) {
        alert('Bạn vui lòng nhập task title');
      } else {
        const taskModel = new TaskModel(uuidv4(), taskNameValue, taskLevelValue);
        Tasks.push(taskModel);
        saveStorage(Tasks);
        renderTasks(Tasks);
      }
    } else {
      // Handle update
      const taskNew = {
        id: __taskTarget.id,
        title: taskNameValue,
        level: taskLevelValue
      }

      const indexTask = Tasks.findIndex(function (item) {
        if (item.id === __taskTarget.id) {
          return true;
        }
        return false;
      });

      Tasks.splice(indexTask, 1, taskNew);
      renderTasks(Tasks);
      saveStorage(Tasks);
    }

    // Handle reset form
    __taskTarget = null;
    $taskName.value = '';
    $taskLevel.value = 1;
    toggleForm();
  }

  function saveStorage(tasks) {
    localStorage.setItem(LOCAL_STORAGE_TASK_LIST, JSON.stringify(tasks));
  }

  function toggleForm() {
    if (__isShowForm === true) {// nếu bằng true => form đang bậc
      // Tắc form đi
      $mainForm.classList.add('hidden');
      $btnToggle.innerText = 'Hiển thị form';
      $btnToggle.classList.remove('show');
      $btnToggle.classList.add('hidden');
      __isShowForm = false;
    } else {// nếu bằng false => form đang tắc
      // Bặc form lên
      $mainForm.classList.remove('hidden');
      $btnToggle.innerText = 'Bậc form lên';
      $btnToggle.classList.remove('hidden');
      $btnToggle.classList.add('show');
      __isShowForm = true;
    }
  }

  function handleDelete() {
    const $listButtonDelete = document.querySelectorAll('.btn-delete');

    $listButtonDelete.forEach($el => {
      $el.addEventListener('click', function (e) {
        const $btn = e.target;
        const $parent = $btn.parentNode.parentElement;
        const taskId = $parent.getAttribute('data-id');
        if (handleConfirm('You are sure delete this task?')) {
          const indexTask = Tasks.findIndex(function (item) {
            if (item.id === taskId) {
              return true;
            }
            return false;
          });

          Tasks.splice(indexTask, 1);
          renderTasks(Tasks);
          saveStorage(Tasks);
        }
      });
    });
  }

  function handleConfirm(textConfirm) {
    const confirmed = confirm(textConfirm);
    return confirmed;
  }

  function handleEdit() {
    const $listButtonEdit = document.querySelectorAll('.btn-edit');

    $listButtonEdit.forEach($el => {
      $el.addEventListener('click', function (e) {
        const $btn = e.target;
        const $parent = $btn.parentNode.parentElement;
        const taskId = $parent.getAttribute('data-id');

        __taskTarget = Tasks.find(function (item) {
          if (item.id === taskId) {
            return true;
          }
          return false;
        });

        $mainForm.classList.remove('hidden');
        $btnToggle.innerText = 'Bậc form lên';
        $btnToggle.classList.remove('hidden');
        $btnToggle.classList.add('show');
        __isShowForm = true;

        const $taskName = document.getElementById('task-name-value');
        const $taskLevel = document.getElementById('task-level-value');

        $taskName.value = __taskTarget.title;
        $taskLevel.value = __taskTarget.level;
      });
    });
  }

  function search(e) {
    // Lấy giá trị trong input
    __searchString = e.target.value;
    // Copy ds task list của mình qua một ds mới
    // Tại sao phải copy
    // Để ko bị thay đổi giá trị của task gốc => Tasks
    // let taskListCopy = [...Tasks];
    // const result = taskListCopy.filter((task) => {
    //   if ( (task.title.toLowerCase()).includes(__searchString.toLowerCase()) ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });

    // if (result.length === 0) {
    //   toggleNotFound(false);
    // } else {
    //   toggleNotFound(true);
    // }

    // renderTasks(result);
    filterData();
  }

  function sort(e) {
    // e.target => DOM;
    // e.target.value => giá trị của input

    // Cắt chuỗi thành 2 phần
    const value = (e.target.value).split('-');

    const sortBy = value[0];
    const orderBy = value[1];

    __sortData.sortBy = sortBy;
    __sortData.orderBy = orderBy;

    // $sortValue.innerHTML = `${sortBy.toUpperCase()} - ${orderBy.toUpperCase()}`;
    filterData();
  }

  function filterData() {
    // Vừa sử lý search và sort trong cùng một function
    // Sort trước hay search trước
    let taskListCopy = [...Tasks];
    const result = taskListCopy.filter((task) => {
      if ( (task.title.toLowerCase()).includes(__searchString.toLowerCase()) ) {
        return true;
      } else {
        return false;
      }
    });

    // giá trị sắp sếp: 2 => title, level

    /**
     * result = [
     *   0: { id: 1, title: 'task item 1' },
     *   1: { id: 1, title: 'task item 1' },
     *   2: { id: 1, title: 'task item 1' },
     *   3: { id: 1, title: 'task item 1' },
     * ];
     * length: 4
     * 1,2,3,4
     */

    if (__sortData.sortBy === 'title') {

      let tmp = {};

      /**
       * vong lap 1
       * result.length - 1 = 3
       */
      for (let i = 0; i < result.length - 1; i++) {
        // kiểm tra order by
        if (__sortData.orderBy === 'asc') {
          // Sắp xếp tăng dần
          if ( result[i].title > result[i+1].title ) {
            tmp = result[i];
            result[i] = result[i+1];
            result[i+1] = tmp;
          }
        } else {
          // Sắp xếp giảm dần
          // 4,3,2,1
          if ( result[i].title < result[i+1].title ) {
            tmp = result[i];
            result[i] = result[i+1];
            result[i+1] = tmp;
          }
        }
      }
    } else {
      // Sắp sếp theo level
      // Bai tap...
    }

    renderTasks(result);
  }

  function toggleNotFound(state) {
    if (state) {
      // Có giá trị
      $mainContent.style.display = 'block';
      $imageNotFound.style.display = 'none';
    } else {
      // Không có giá trị
      $mainContent.style.display = 'none';
      $imageNotFound.style.display = 'block';
    }
  }

  /**
   * Handle render list task into HTML DOM
   * @param {array} tasks
   * @returns void
   */
  function renderTasks(tasks) {
    toggleNotFound(tasks.length);

    let tasksHTMLArray = tasks.map(function(item, index) {
      return `<tr data-id="${item.id}">
                <td>${index + 1}</td>
                <td>${item.title}</td>
                <td>
                  <span class="tag ${convertLevel(item.level).toLowerCase()}">${convertLevel(item.level)}</span>
                </td>
                <td>
                  <button class="btn-edit" type="button">Edit</button>
                  <button class="btn-delete" type="button">Delete</button>
                </td>
              </tr>`;
    });

    const tasksHTMLString = tasksHTMLArray.join('');
    $table.innerHTML = tasksHTMLString;
    handleDelete();
    handleEdit();
  }

  function renderSortList(list) {
    let sortHTMLArray = list.map(function(item) {
      return `<option value="${item.sortBy}-${item.orderBy}">${(item.sortBy).toUpperCase()} - ${(item.orderBy).toUpperCase()}</option>`;
    });

    const sortHTMLString  = sortHTMLArray.join('');
    $sortSelect.innerHTML = sortHTMLString;
    $sortValue.innerHTML  = `${list[0].sortBy.toUpperCase()} - ${list[0].orderBy.toUpperCase()}`;
  }
}