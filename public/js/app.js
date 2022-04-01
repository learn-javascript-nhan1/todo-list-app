
import { covertLevel } from "../utils/helpers.js";
import TaskModel from "../models/task.js";

const sortTypeData = [
{
 sortBY : "title ",
  oderBy: " asc",
},
{
 sortBY : "title ",
  oderBy: " desc",
},
{
 sortBY : "level ",
  oderBy: " asc",
},
{
 sortBY : "level ",
  oderBy: " desc",
},

];

init(); 


function init(){

  
    
  //  lấy Dom
  const $searchInput = document.getElementById('search-task-input');
  const $sortSelect = document.getElementById('sort-select');
  const $mainContent = document.getElementById('main-content');
  const $imageNotFound = document.getElementById('not-found');
  const $table = document.getElementById('task-content');
  const $sortValue = document.getElementById('sort-value');
  const $btnToggle = document.getElementById('btn-toggle');
  const $mainForm  = document.getElementById('form-main');
  const LOCAL_STORAGE_TASK_LIST = 'taskList';

  const taskInLocalStore = localStorage.getItem(LOCAL_STORAGE_TASK_LIST) 
                            ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_LIST)) 
                            : [];

  let Tasks = taskInLocalStore;

  renderTasks(Tasks);
  renderSortList(sortTypeData);
  
  let __isShowForm = false;
  let __searchString = '';
  let __sortData = {
    sortBy:'title',
    oderBy: 'asc'
  };

  let __taskTarget = null;

  // add sự kiện 
  $searchInput.addEventListener('input', search);
  $sortSelect.addEventListener('change', sort);
  $btnToggle.addEventListener('click', toggleForm);
  $mainForm.addEventListener('submit', submitForm);
  
  function submitForm (e){
    const $taskName  = document.getElementById('task-name-value');
    const $taskLevel = document.getElementById('task-level-value');
    const taskNameValue = $taskName.value;
    const taskLevelValue = parseInt($taskLevel.value);

    e.preventDefault();
    if(__taskTarget === null){
      if (taskNameValue.length <= 0) {
        alert('Bạn vui lòng nhập task Title ');
      }else {
        const taskModel = new TaskModel(uuidv4(), taskNameValue, taskLevelValue);
        Tasks.push(taskModel);
        renderTasks(Tasks);
        saveStorage(Tasks);
      } 
      }else {
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
    // handle reset form
    __taskTarget = null;
    $taskName.value = '';
    $taskLevel.value = 1;
    toggleForm();
  }

  function saveStorage(tasks) {
    localStorage.setItem(LOCAL_STORAGE_TASK_LIST, JSON.stringify(tasks));
  }
  
  function toggleForm() {
    if(__isShowForm === true) {
      // Tắt form đi 
      $mainForm.classList.add('hidden')
      $btnToggle.innerText = ('Hiển thị form');
      $btnToggle.classList.remove('show');
      $btnToggle.classList.add('hidden');
      __isShowForm = false ;
    } else {
      $mainForm.classList.remove('hidden')
      $btnToggle.innerText = ('Bật form lên');
      $btnToggle.classList.remove('hidden');
      $btnToggle.classList.add('show');
      __isShowForm = true ;
    }
  }

  function handleDelete() {
    // lấy danh sách Dom
    const $listButtonDelete = document.querySelectorAll('.btn-delete');

    $listButtonDelete.forEach($el => {
      $el.addEventListener('click', function (e) {
        const $btn = e.target;
        const $parent = $btn.parentNode.parentElement;
        const taskId = $parent.getAttribute('data-id');
        if(handleConFirm('you are sure delete this task?')) {
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

  function handleEdit(){
    const $listButtonEdit = document.querySelectorAll('.btn-edit');
    
    $listButtonEdit.forEach($el => {
      $el.addEventListener('click', function(e) {
        const $btn = e.target;
        const $parent = $btn.parentNode.parentElement;
        const taskId = $parent.getAttribute('data-id');

        __taskTarget = Tasks.find(function(item) {
          if(item.id === taskId) {
            return true;
          }
          return false;
        });

        $mainForm.classList.remove('hidden');
        $btnToggle.innerText = 'Bật form lên';
        $btnToggle.classList.remove('hidden');
        $btnToggle.classList.add('show');
        __isShowForm = true;

        const $taskName  = document.getElementById('task-name-value');
        const $taskLevel = document.getElementById('task-level-value');

        $taskName.value = __taskTarget.title;
        $taskLevel.value = __taskTarget.level;
      });
    });
  }

  function handleConFirm(textConfirm) {
    const confirmed = confirm(textConfirm);
    return confirmed;
  }

  function search(e){
    // Lấy giá trị trong input
    __searchString = e.target.value;
    // // Coppy ds task list của mình qua ds mới 
    // // Tại sao phải coppy
    // //  Để không thay đổi giá trị của Task gốc => Tasks
    // const taskListCopy = [... Tasks];
    // // filter lọc ra các phần tử và làm theo điều kiện mình mong muốn
    // // includes lọc các phần tử mình mún lọc
    // // toLowerCase() Chuyển chữ hoa thành thường
    // const result = taskListCopy.filter((task) => {
    //   if ((task.title.toLowerCase()).includes(__searchString.toLowerCase())) {
    //     return true;
    //   }else {
    //     return false;
    //   }

    // });

    // renderTasks(result);
    filterData();
    
  }

  function sort(e){
    // e.target =>  Dom
    // e.target.value: Lấy giá trị của input
    // split: cắt chuỗi 2 thành phần 
    const value = (e.target.value).split('-');
    // // gán sortBy = value [giá trị index]
    // // gán oderBy = value [giá trị index]
    const sortBy = value[0];
    const oderBy = value[1];

    __sortData.sortBy = sortBy;
    __sortData.oderBy = oderBy;

    
    // $sortValue.innerHTML =`${sortBy} - ${oderBy}`;
    filterData();
  }

  function filterData(){
    let taskListCopy = [... Tasks];
    const result = taskListCopy.filter((task) => {
        if ((task.title.toLowerCase()).includes(__searchString.toLowerCase())) {
          return true;
        }else {
          return false;
        }
      });
      // giá trị sắp xếp: 2 => title, level

      if(__sortData.sortBy === 'title'){

        let tmp = {};

        // length = 4
        // i = 0; 
        // 0 < result.length = true
        // console.log(" Chương trình tiếp tục chay ")
        // i++ => i = 1
      for (let i = 0; i < result.length; i++){
        // kiểm tra oderBy
        if(__sortData.oderBy === 'asc'){
          // sắp xếp tăng dần
          if(result[i].title > result[i+1].title){
            tmp = result[i];
            result[i] = result[i+1];
            result[i+1] = tmp;
          }
        } else {
          // sắp xếp giảm dân
          if(result[i].title < result[i+1].title){
            tmp = result[i];
            result[i] = result[i+1];
            result[i+1] = tmp;
          }
        }
      }
        
    } else {
      
    }

    renderTasks(result);

  }

  function toggleNotFound (state){
    if(state){
      $mainContent.style.display = 'block';
      $imageNotFound.style.display = 'none';
    } else {
      $mainContent.style.display = 'none';
      $imageNotFound.style.display = 'block';
    }
  }

    
  // render list task into Dom HTML
  function renderTasks (tasks){
      
      toggleNotFound(tasks.length);
      
      let taskHTMLArray = tasks.map(function( item, index){
          //  render dữ liệu ra table
          // 
          return `<tr data-id="${item.id}">
          <td>${index + 1}</td>
          <td>${item.title}</td>
          <td>
            <span class=" tag ${covertLevel(item.level).toLowerCase()}">${covertLevel(item.level)}</span>
          </td>
          <td>
            <button class="btn-edit" type="button">Edit</button>
            <button class="btn-delete" type="button">Delete</button>
          </td>
        </tr>`
      });
      
      //  Từ dạng Array chuyển về dạng String HTML
    const taskHTMLString = taskHTMLArray.join('');
    $table.innerHTML = taskHTMLString;
    handleDelete();
    handleEdit();
  }

  function renderSortList(list){
    let sortHTMLArray = list.map(function(item) {
      // .toUpperCase(): chữ thường thành hoa
      return `<option value="${(item.sortBY).toUpperCase()}-${(item.oderBy).toUpperCase()}">${(item.sortBY).toUpperCase()}-${(item.oderBy).toUpperCase()}</option>`;
    });
    //  Từ dạng Array chuyển về dạng String HTML
    const sortHTMLString = sortHTMLArray.join('');

    $sortSelect.innerHTML = sortHTMLString ;
    $sortValue.innerHTML = `${list[0].sortBY.toUpperCase()} - ${list[0].oderBy.toUpperCase()}`;
  }
}