import { Typography } from 'antd';

// @components
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { PersonaForm } from 'components/PersonaForm/PersonaForm';
import { useNavigate } from 'react-router-dom';

// @hooks
import { useNotifications } from 'shared/hooks/useNotifications';
import { useMutationRequest } from 'shared/hooks/useRequest';

// @constants
import { APP_ROUTES } from 'shared/routes';

// @types
import { MOUSE_TYPES, PersonaType } from 'shared/types/personaType';

const initialValues: Partial<PersonaType> = {
  language: 'en-US',
  mousePersona: MOUSE_TYPES.Mouse,
  voicePace: 1,
  mouseAcceleration: 1,
};

export default function NewPersona() {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const navigate = useNavigate();

  /**
   * queries
   */
  const [createPersona, { isLoading }] = useMutationRequest<Partial<PersonaType>, PersonaType>(
    APP_ROUTES.PERSONAS
  );

  /**
   * Callbacks
   */
  const handleGoBack = () => navigate(`/${APP_ROUTES.PERSONAS}`);
  const handleCreatePersona = async (values: PersonaType) => {
    const { error, data } = await createPersona(values);
    if (error) {
      return errorNotification('Persona error', 'Could not create Persona', { error });
    }

    handleGoBack();
    return successNotification(
      'Success',
      <Typography.Text>
        Persona <Typography.Text strong>{data?.name}</Typography.Text> created successfully
      </Typography.Text>
    );
  };

  return (
    <ContainerPage title='New Persona' onBack={handleGoBack}>
      <PersonaForm
        onFinish={handleCreatePersona}
        loading={isLoading}
        initialValues={initialValues}
      />
    </ContainerPage>
  );
}
