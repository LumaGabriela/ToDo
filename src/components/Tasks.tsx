import './Tasks.css';
import {
  IonIcon, 
  IonFab, 
  IonItem, 
  IonList, 
  IonLabel, 
  IonCheckbox, 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonButton,
  IonButtons,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption, 
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonTitle,
  IonDatetime,
  IonDatetimeButton,
  IonPopover,
  useIonToast

} from '@ionic/react';
import { add, checkmarkDoneOutline, chevronForwardOutline, closeOutline } from 'ionicons/icons'
import { useEffect, useRef, useState } from 'react'
import Props from '../props'
import { OverlayEventDetail } from '@ionic/core/components'
import { format, parseISO } from 'date-fns'

const Tasks: React.FC<Props> = ({ 
  name,
  data,
  updateData
}) => {
  const [currentList, setCurrentList] = useState([])

  const modal = useRef<HTMLIonModalElement>(null)

  const title = useRef<HTMLIonInputElement>(null)
  const date = useRef<HTMLIonDatetimeElement>(null)
  const folder = useRef<HTMLIonSelectElement>(null)

  const [taskTags, setTaskTags] = useState([])
  const [task, setTask] = useState({})
  const [allTasks, setAllTasks] = useState([])

  const [presentToast] = useIonToast()

  const confirm = () => modal.current?.dismiss(title.current?.value, 'confirm')
// Lida com o fechamento do modal menu
  const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
    if (ev.detail.role === 'confirm') {
    setTask({
      title: title.current?.value, 
      folder: folder.current?.value,
      date: date.current?.value,
      done: false,
      id: '' + new Date().getTime()
      })   
    }
  }

  const addTask = async () => {
    if (data  && checkFieldValidity(task)){
      const taskcopy = JSON.parse(JSON.stringify(task))
      const datacopy = data.slice()
      for (let obj of datacopy) {
        if (obj.title === taskcopy.folder) {
          const result = obj.tasks.every((item) => item.id !== taskcopy.id)
          if(result) obj.tasks.push(taskcopy)
        }
      }  
      await updateData(datacopy)
      }
       else presentToast({
        message: 'Valores inválidos',
        duration: 1500
       })  
     
  }

  const removeTask = async (id: string, folder: string) => {
    if(data){
      let datacopy = data.filter((item) => item.title !== folder)
      let foldercopy = data.filter((item) => item.title === folder)[0]
      let tasks = foldercopy.tasks.slice()
      tasks = tasks.filter((item, index) => item.id!== id)
      foldercopy.tasks = tasks
      datacopy.push(foldercopy) 
      await updateData(datacopy)
    }
  }
  const updateTask = async (id: string, folder: string) => {
    if(data) {
      let datacopy = data.filter((item)=> item.title !== folder)
      let foldercopy = data.filter((item)=> item.title === folder)[0]
      let tasks = foldercopy.tasks.filter((item) => item.id !== id)
      let task = foldercopy.tasks.filter((item) => item.id === id)[0]
      
      task.done = (task.done  === true ? false : true)
      tasks.push(task)
      foldercopy.tasks = tasks

      datacopy.push(foldercopy)
      await updateData(datacopy)
    }
  }

  const checkFieldValidity = (list:any) => {
    // for(let item in list) if(list[item] === undefined) return false
    // return true
    if(list.title === '') return false
    if(list.done === undefined) return false
    if(list.folder === undefined) return false
    if(list.date === undefined) return false
    if(list.id === undefined) return false
    return true
  }


  useEffect(()=>{
    if (data) {
      
      const datacopy = data.slice() 
    
      let currentlist = []
      let temp = []

      for(let item of datacopy) temp.push(item.title)  

      if (name !== 'Todos'){
        for (let item of datacopy) if(item.title === name) currentlist = item.tasks  
      } else currentlist = allTasks.slice()
      
      setCurrentList(currentlist)
      setTaskTags(temp)
    } 
  }, [name, data, allTasks])

  useEffect(()=>{
    if(data) {
      const datacopy = data.slice()
      let tasklist = []
      for (let folder of datacopy) {
        for (let task of folder.tasks) {
          tasklist.push(task)
        }
      }
    setAllTasks(tasklist)
    }
  },[data])

  useEffect(()=>{ if(Object.keys(task).length !== 0) {addTask()} },[task])



  return (
    <div>
      <IonList className="container" >

        

        {currentList.map((item, index)=> 
        <IonItemSliding key={item.id} className={item.done === true ? 'done' : ''} >

          <IonItem className='task'>
            <IonLabel>
              <h2 className='taskTitle'>{item.title}</h2>
              <p>{item.date ? format(parseISO('' + item.date), 'd MMM, yyyy') : ''}</p>
            </IonLabel>
            {/* <IonLabel> */}
              <p>{name === 'Todos' ? `Caderno: ${item.folder}` : ''}</p>
            {/* </IonLabel>   */}

            <IonCheckbox onClick={()=>updateTask(item.id, item.folder)} color='secondary' slot='start' checked={item.done}/>
          </IonItem>
            
          <IonItemOptions side='end'>
            <IonItemOption className='itemOptionTask' onClick={()=> removeTask(item.id, item.folder)} color='danger'>
              <IonIcon icon={closeOutline}/>
            </IonItemOption>
            </IonItemOptions>

            <IonItemOptions side='start'>
            <IonItemOption className='itemOptionTask' id={`${item.id} click-trigger`} color='primary' >
              
              <IonIcon className='ionIconOption' icon={chevronForwardOutline}/>
            </IonItemOption>
          </IonItemOptions>   
          {/* ion popover menu */}
          <IonPopover trigger={`${item.id} click-trigger`} triggerAction='click'>
            <IonContent class='ion-padding'>{item.title}</IonContent>
          </IonPopover>

          
        </IonItemSliding>)}
      </IonList>
   
      <IonModal ref={modal} trigger='open-modal' onWillDismiss={(ev) => onWillDismiss(ev)}>
          <IonHeader>
            <IonToolbar >

              <IonButtons slot='secondary'>
               <IonButton onClick={ () => modal.current?.dismiss()}>
                Voltar
               </IonButton> 
              </IonButtons>

              <IonTitle size='large'>Nova Tarefa</IonTitle>

              <IonButtons slot='primary'>
                <IonButton strong={true} onClick={()=> confirm()}>
                  Adicionar
                </IonButton>
              </IonButtons>

            </IonToolbar>
          </IonHeader>
          <IonContent>

            <IonItem className='modalInput'>
              <IonLabel position='stacked'>  Tarefa  </IonLabel>
              <IonInput ref={title} type='text' placeholder='Titulo'/>
            </IonItem>

            <IonItem  className='modalInput'>
              <IonLabel position='stacked'>  Data:  </IonLabel>

              <IonDatetimeButton  className='modalInput' color='dark' datetime='datetime'/>

                <IonModal keepContentsMounted={true}>
                  <IonDatetime 
                  showDefaultTitle={true}
                  showDefaultButtons = {true} 
                  doneText='Pronto'
                  cancelText='Cancelar'
                  presentation='date' 
                  ref={date} 
                  id='datetime'></IonDatetime>
                </IonModal>

              
            </IonItem>
         
            <IonItem  className='modalInput'>
              <IonSelect ref={folder} interface='popover' placeholder='Selecione o caderno'>
                {taskTags.map((item, index)=>{ 
                  return(
                  <IonSelectOption key={index} value={item}>{item}</IonSelectOption>
                )
                })}
              </IonSelect>
            </IonItem>

          </IonContent>
      </IonModal>
      
         
      
      <IonFab className='addButton' vertical='bottom' horizontal='end'>
        <IonButton  id="open-modal" expand="block" >
          <IonIcon  icon={add}></IonIcon>
        </IonButton>
      </IonFab>
    </div>
  );
};

export default Tasks;
