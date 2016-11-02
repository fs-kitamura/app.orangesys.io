
import {
  isAuthenticated,
  needEmailVerification,
  needSetupPlan,
} from 'src/core/auth';
import { planSelected } from 'src/core/setup';
import App from './app';
import Home from 'src/views/pages/home';
import SignUp from 'src/views/pages/sign-up';
import SignIn from 'src/views/pages/sign-in';
import VerificationGuide from 'src/views/pages/verification-guide';
import Verify from 'src/views/pages/verify';
import SetupPlan from 'src/views/pages/setup/plan';
import SetupPayment from 'src/views/pages/setup/payment';
import SetupComplete from 'src/views/pages/setup/complete';
import UITest from './pages/ui-test';

export const paths = {
  ROOT: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  VERIFICATION_GUIDE: '/verification-guide',
  VERIFY: '/verify',
  SETUP_PLAN: '/setup/plan',
  SETUP_PAYMENT: '/setup/payment',
  SETUP_COMPLETE: '/setup/complete',
};

const requireAuth = getState => (
  (nextState, replace) => {
    if (!isAuthenticated(getState())) {
      replace(paths.SIGN_IN);
      return;
    }
    if (needEmailVerification(getState())) {
      replace(paths.VERIFICATION_GUIDE);
      return;
    }
    if (needSetupPlan(getState())) {
      replace(paths.SETUP_PLAN);
    }
  }
);

const shouldVerifyEmail = getState => (
  (nextState, replace) => {
    if (!isAuthenticated(getState())) {
      replace(paths.SIGN_IN);
      return;
    }
    const needVerification = needEmailVerification(getState());
    if (!needVerification) {
      replace(paths.ROOT);
    }
  }
);

const shouldSetupPlan = getState => (
  (nextState, replace) => {
    if (!isAuthenticated(getState())) {
      replace(paths.SIGN_IN);
      return;
    }
    if (!needSetupPlan(getState())) {
      replace(paths.ROOT);
    }
  }
);

const canSetupPayment = getState => (
  (nextState, replace) => {
    if (!isAuthenticated(getState())) {
      replace(paths.SIGN_IN);
      return;
    }
    if (!needSetupPlan(getState())) {
      replace(paths.ROOT);
      return;
    }
    if (!planSelected(getState())) {
      replace(paths.SETUP_PLAN);
    }
  }
);


const requireUnauth = getState => (
  (nextState, replace) => {
    if (isAuthenticated(getState())) {
      replace(paths.ROOT);
    }
  }
);

export const getRoutes = getState => (
  {
    path: paths.ROOT,
    component: App,
    childRoutes: [
      {
        indexRoute: {
          component: Home,
          onEnter: requireAuth(getState),
        },
      },
      {
        path: paths.VERIFICATION_GUIDE,
        component: VerificationGuide,
        onEnter: shouldVerifyEmail(getState),
      },
      {
        path: paths.VERIFY,
        component: Verify,
        onEnter: shouldVerifyEmail(getState),
      },

      {
        path: paths.SIGN_UP,
        component: SignUp,
        onEnter: requireUnauth(getState),
      },
      {
        path: paths.SIGN_IN,
        component: SignIn,
        onEnter: requireUnauth(getState),
      },
      {
        path: paths.SETUP_PLAN,
        component: SetupPlan,
        onEnter: shouldSetupPlan(getState),
      },
      {
        path: paths.SETUP_PAYMENT,
        component: SetupPayment,
        onEnter: canSetupPayment(getState),
      },
      {
        path: paths.SETUP_COMPLETE,
        component: SetupComplete,
        onEnter: !canSetupPayment(getState),
      },
      {
        path: 'ui-test',
        component: UITest,
      },
    ],
  }
);
