import Tasks from "../data/tasks.js";
import { covertLevel } from "../utils/helpers.js";
 
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

  renderTasks(Tasks);
  renderSortList(sortTypeData);
  


  let searchString = '';
  let sortData = {
    sortBy:'title',
    oderBy: 'asc'
  };




  // add sự kiện 
  $searchInput.addEventListener('input', search)
  $sortSelect.addEventListener('change', sort)

  function search(e){
    // Lấy giá trị trong input
    searchString = e.target.value;
    // // Coppy ds task list của mình qua ds mới 
    // // Tại sao phải coppy
    // //  Để không thay đổi giá trị của Task gốc => Tasks
    // const taskListCopy = [... Tasks];
    // // filter lọc ra các phần tử và làm theo điều kiện mình mong muốn
    // // includes lọc các phần tử mình mún lọc
    // // toLowerCase() Chuyển chữ hoa thành thường
    // const result = taskListCopy.filter((task) => {
    //   if ((task.title.toLowerCase()).includes(searchString.toLowerCase())) {
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

    sortData.sortBy = sortBy;
    sortData.oderBy = oderBy;

    
    // $sortValue.innerHTML =`${sortBy} - ${oderBy}`;
    filterData();
  }

  function filterData(){
    let taskListCopy = [... Tasks];
    const result = taskListCopy.filter((task) => {
        if ((task.title.toLowerCase()).includes(searchString.toLowerCase())) {
          return true;
        }else {
          return false;
        }
        
  
      });
     

      // giá trị sắp xếp: 2 => title, level

      if(sortData.sortBy === 'title'){

        let tmp = {};

        // length = 4
        // i = 0; 
        // 0 < result.length = true
        // console.log(" Chương trình tiếp tục chay ")
        // i++ => i = 1
      for (let i = 0; i < result.length; i++){
        // kiểm tra oderBy
        if(sortData.sortBy === 'asc'){
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
          return `<tr data-id="${item.id} ">
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

  }

  function renderSortList(list){
    let sortHTMLArray = list.map(function(item) {
      // .toUpperCase(): chữ thường thành hoa
      return `<option = value="${(item.sortBY).toUpperCase()}-${(item.oderBy).toUpperCase()}">${(item.sortBY).toUpperCase()}-${(item.oderBy).toUpperCase()}</option>`;
    });
    //  Từ dạng Array chuyển về dạng String HTML
    const sortHTMLString = sortHTMLArray.join('');

    $sortSelect.innerHTML = sortHTMLString ;
    $sortValue.innerHTML = `${list[0].sortBY.toUpperCase()} - ${list[0].oderBy.toUpperCase()}`;
  }
}