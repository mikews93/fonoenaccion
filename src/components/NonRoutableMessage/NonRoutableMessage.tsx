import { CONTACT_SUPPORT_NEW_TICKET, NON_ROUTABLE_ROUTES } from './constants';

import styles from './styles.module.scss';

export const NonRoutableMessage = () => {
  return (
    <div className={styles.nonRoutableMessage}>
      <div>
        <div>You are using a non-Routable IP address for your host name.</div>
        <div>
          Please set up a VPN connection with Videate. Need help? &nbsp;
          <a href={CONTACT_SUPPORT_NEW_TICKET} target='_blank' rel='noopener noreferrer'>
            Contact support.
          </a>
        </div>
      </div>

      <h4>Those non-routable IP addresses are the following:</h4>
      <ul>
        {Object.entries(NON_ROUTABLE_ROUTES).map(([route, props], index) => (
          <li key={index}>
            {route} (Range: {props.range}) — Available IPs:
            {props.availableIPs}
          </li>
        ))}
      </ul>
    </div>
  );
};
