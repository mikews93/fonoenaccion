import { Typography } from 'antd';

// @components
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { PersonaForm } from 'components/PersonaForm/PersonaForm';

// @hooks
import { useNotifications } from 'shared/hooks/useNotifications';
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useLocation, useNavigate } from 'react-router-dom';

// @constants
import { APP_ROUTES } from 'shared/routes';

// @types
import { PersonaType } from 'shared/types/personaType';

export default function PersonaDetails() {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * queries
   */
  const [persona] = useGetRequest<PersonaType>(location.pathname, null);
  const [updatePersona, { isLoading }] = useMutationRequest<Partial<PersonaType>, PersonaType>(
    location.pathname,
    'PUT'
  );

  /**
   * Callbacks
   */
  const handleGoBack = () => navigate(`/${APP_ROUTES.PERSONAS}`);
  const handleUpdatePersona = async (values: PersonaType) => {
    const { error, data } = await updatePersona(values);
    if (error) {
      return errorNotification('Persona error', 'Could not update Persona', { error });
    }

    handleGoBack();
    return successNotification(
      'Success',
      <Typography.Text>
        Persona <Typography.Text strong>{data?.name}</Typography.Text> updated successfully
      </Typography.Text>
    );
  };

  return (
    <ContainerPage title='Persona details' onBack={handleGoBack}>
      <PersonaForm
        onFinish={handleUpdatePersona}
        initialValues={persona}
        finishText='Update'
        loading={isLoading}
      />
    </ContainerPage>
  );
}
