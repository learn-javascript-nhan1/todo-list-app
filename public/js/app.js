import Tasks from '../data/tasks.js';
import {covertLevel} from '../utils/helpers.js'

 const sortTypeData  = [
    {
        sortBy: 'title ',
        oderBy : ' acs',
    },
    {
        sortBy: 'title ',
        oderBy : ' desc',
    },
    {
        sortBy: 'level ',
        oderBy : ' acs',
    },
    {
        sortBy : 'level ',
        oderBy : ' desc',
    },
];

init();

function init(){
    const $searchInput = document.getElementById ('search-task-input');
    const $sortSelect = document.getElementById ('sort-select');
    const $mainContent = document.getElementById ('main-content');
    const $imageNotFound = document.getElementById ('not-found');
    const $table = document.getElementById('task-content');
    const $sortValue = document.getElementById('sort-value');


    renderTasks(Tasks);
    renderSortList(sortTypeData);
    

    let searchString = '';
    let sortData = {
        sortBy: 'title',
        oderBy: ' asc ',
    };
    
 
    $searchInput.addEventListener('input', search);
    $sortSelect.addEventListener('change' , sort);


    function search(e){
    //     searchString = e.target.value ;
       
    //     let taskListCopy = [... Tasks];
    //     const result = taskListCopy.filter((task) => {
    //          if ( (task.title.toLocaleLowerCase()).includes(searchString.toLocaleLowerCase())){
    //             return true;
    //         } else{
    //             return false;
    //         }
    //      });

    //     if (result.length === 0 ){
    //        toggleNotFound(false);
        
    //      } else{
    //          toggleNotFound(true);
    //   }


    //     renderTasks(result);

      filterData();
    }

    function sort(e){
    //     const value = e.target.value.split('-') ;
    
    //    const sortBy = value[0] ;
    //    const oderBy = value[1] ;
    //    sortData.sortBy = oderBy;
    //    sortData.oderBy = sortBy;

    //     console.log(sortBy);
    //     console.log(oderBy);
    //     $sortValue.innerHTML = `${sortBy.toUpperCase()} - ${oderBy.toUpperCase()}`;
    //     filterData();
    filterData();
    }

    function filterData() {
        // let taskListCopy = [... Tasks];
        // const result = taskListCopy.filter((task) => {
        //      if ( (task.title.toLocaleLowerCase()).includes(searchString.toLocaleLowerCase())){
        //          return true;
        //      } else{
        //         return false;
        //      }
        // });     
  
        //     if (sortData.sortBy === 'title') {

        //         let tmp = {};


        //     for (let i=0; i < result.length - 1; i++){
        //         if (sortData.oderBy === 'asc'){  
        //             if( result[i].title > result[i+1].title ){
        //                 tmp = result[1];
        //                 result[1] = result[i+1];
        //                 result[i+1] = tmp;
        //             }
        //         }else{
        //             if( result[i].title < result[i+1].title ){
        //                 tmp = result[1];
        //                 result[1] = result[i+1];
        //                 result[i+1] = tmp;
        //            }
        //         }    
        //     }                         
        // }   else{
                
        // }   


        // renderTasks(result);

            console.log('handle filter data');
            console.log(searchString) ;



    }
   
    function toggleNotFound(state){
 
         if(state) {
            // co giá trị 
            $mainContent.style.display = 'block';
            $imageNotFound.style.display = 'none';
        } else {
        // không có giá trị
            $mainContent.style.display = 'none';
            $imageNotFound.style.display = 'block';
    
        }
    



    }
    function renderTasks (tasks){
        toggleNotFound(tasks.length);
 
 
        let tasksHTMLArray = tasks.map(function(item, index){
                 return `<tr data-id="${item.id}">
                 <td>${index + 1}</td>
                 <td>${item.title}</td>
                 <td>
                     <span class="tag ${covertLevel(item.level).toLocaleLowerCase()}">${covertLevel(item.level)}</span>
                 </td>
                 <td>
                     <button class="btn-edit" type="button">Edit</button>
                     <button class="btn-delete" type="button">Delete</button>
                 </td>
                 </tr>`;
        });
        const taskHTMLString = tasksHTMLArray.join('');
        
        $table.innerHTML = taskHTMLString ;
    }
    function renderSortList (list){
        let sortHTMLArray = list.map(function(item) {
            return `<option value="${item.sortBy}-${item.oderBy}">${(item.sortBy).toUpperCase()}-${(item.oderBy).toUpperCase()}</option>`;
        });
      
        const sortHTMLString = sortHTMLArray.join('');
        $sortSelect.innerHTML= sortHTMLString ;

        $sortValue.innerHTML = `${list[0].sortBy.toUpperCase()} - ${list[0].oderBy.toUpperCase()}`;
    }
}
