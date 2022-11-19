import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonInput,
  IonButtons,
  IonButton,
  IonToolbar
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';

import { useLocation } from 'react-router-dom';

import './Menu.css';
import Props from '../props'
import { closeOutline, addCircleSharp, folder } from 'ionicons/icons';


const Menu: React.FC<Props> = ({data, updateData}) => {
  const location = useLocation();
  const [pages, setPages] = useState<any>([])

  const input = useRef<HTMLIonInputElement>(null)
  

  const addFolder =  async () => {
    if(data){
      let datacopy = data.slice()
      let folderTitle = input.current.value.toString()
      
      let newfolder = {
        title: folderTitle,
        id: '' + new Date().getTime(),
        tasks: []
      }

      input.current.value = ''    
      const result  = datacopy.every((item, index)=> item.title !== folderTitle )

      if(result  && folderTitle.split('').length > 0) {
        datacopy.push(newfolder)
        updateData(datacopy)
      }
      else console.log('Valor invalido!!!')
  }
  
  }
  const removeFolder = async (title) => {
    const datacopy = data.filter((item, index)=> item.title !== title)
    updateData(datacopy)
  }

  useEffect(()=> {
    if( data ){
      const datacopy = data.slice()
      let tempAppPages = []

      for( let item of datacopy) tempAppPages.push({title : item.title, url: '/page/' + item.title})
          
      setPages(tempAppPages)
    } 
  },[data])

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Tarefas</IonListHeader>
          
          <IonMenuToggle key='Todos' autoHide={false}>
                
            <IonItem className={location.pathname === '/page/Todos' ? 'Todos selected' : 'Todos'} routerLink={'Todos'} routerDirection="none" lines="none" detail={false}>
              
              <IonLabel>{'Todos'}</IonLabel>
            </IonItem>

          </IonMenuToggle>
          
          {pages.map((appPage, index) => {
            if (appPage) return (
 
              <IonMenuToggle key={index} autoHide={false}>
                <IonToolbar>

                  <IonItem className={location.pathname === appPage.url ? 'folder selected' : 'folder'} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>          
                    <IonLabel>{appPage.title}</IonLabel>

                  </IonItem>
                  
                  <IonButtons slot='secondary'>
                    <IonButton color='danger' onClick={() => removeFolder(appPage.title)}>
                      <IonIcon slot='icon-only' icon={closeOutline}/>
                    </IonButton>
                  </IonButtons>  

                </IonToolbar>
                
              </IonMenuToggle> 
            )
            })}
          
        </IonList>
        <IonItem className='addTaskContainer'>
          <IonInput className='taskInput' placeholder='Novo caderno' ref={input} />
          <IonButton className='addTaskBtn' onClick={() => addFolder()} >
            <IonIcon className='addTaskIcon' size='large' icon={addCircleSharp}/>
          </IonButton>

        </IonItem>
        

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
