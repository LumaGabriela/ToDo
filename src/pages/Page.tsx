import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import { useParams } from 'react-router';
import Tasks from '../components/Tasks';
import './Page.css';

import Props from '../props'

const Page: React.FC<Props> = ({data, updateData}) => {

  const { name } = useParams<{ name: string; }>();


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Tasks name={name}  
        data={data}
        updateData={updateData}
        />
      </IonContent>
    </IonPage>
  );
};

export default Page;
