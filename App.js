import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Auth
import AuthScreen from './src/screens/AuthScreen';

// Role Dashboards
import CounsellorDashboard from './src/screens/CounsellorDashboard';
import AdminDashboard from './src/screens/AdminDashboard';

// Student App Screens
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ArticleScreen from './src/screens/ArticleScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import CounsellorScreen from './src/screens/CounsellorScreen';
import JournalScreen from './src/screens/JournalScreen';
import WellnessScreen from './src/screens/WellnessScreen';
import SessionRatingScreen from './src/screens/SessionRatingScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import { FeedbackScreen, CallScreen } from './src/screens/FeedbackAndCallScreens';

// Navigation
import BottomNav from './src/navigation/BottomNav';
import { colors } from './src/theme/colors';

const MODAL_SCREENS = ['Article', 'AIChat', 'Counsellor', 'Journal', 'Wellness', 'Feedback', 'Call', 'SessionRating', 'ChangePassword'];
const TAB_SCREENS = ['Home', 'Explore', 'Search', 'Profile'];

// ── STUDENT APP ───────────────────────────────────────────────────────────────
function StudentApp() {
  const [activeTab, setActiveTab] = React.useState('Home');
  const [stack, setStack] = React.useState([]);

  const navigation = {
    navigate: (screen, params) => {
      if (MODAL_SCREENS.includes(screen)) {
        setStack(prev => [...prev, { screen, params }]);
      } else if (TAB_SCREENS.includes(screen)) {
        setStack([]);
        setActiveTab(screen);
      }
    },
    goBack: () => setStack(prev => prev.slice(0, -1)),
  };

  const topOfStack = stack[stack.length - 1];

  const renderTabScreen = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen navigation={navigation} />;
      case 'Explore': return <ExploreScreen navigation={navigation} />;
      case 'Search': return <SearchScreen navigation={navigation} />;
      case 'Profile': return <ProfileScreen navigation={navigation} />;
      default: return <HomeScreen navigation={navigation} />;
    }
  };

  const renderStackScreen = ({ screen, params }) => {
    switch (screen) {
      case 'Article': return <ArticleScreen navigation={navigation} route={{ params }} />;
      case 'AIChat': return <AIChatScreen navigation={navigation} />;
      case 'Counsellor': return <CounsellorScreen navigation={navigation} />;
      case 'Journal': return <JournalScreen navigation={navigation} />;
      case 'Wellness': return <WellnessScreen navigation={navigation} />;
      case 'Feedback': return <FeedbackScreen navigation={navigation} />;
      case 'Call': return <CallScreen navigation={navigation} />;
      case 'SessionRating': return <SessionRatingScreen navigation={navigation} route={{ params }} />;
      case 'ChangePassword': return <ChangePasswordScreen navigation={navigation} />;
      default: return null;
    }
  };

  return (
    <View style={styles.root}>
      <View style={{ flex: 1 }}>{renderTabScreen()}</View>
      {topOfStack && (
        <View style={StyleSheet.absoluteFill}>
          {renderStackScreen(topOfStack)}
        </View>
      )}
      {!topOfStack && (
        <BottomNav activeTab={activeTab} onTabPress={tab => { setStack([]); setActiveTab(tab); }} />
      )}
    </View>
  );
}

// ── COUNSELLOR APP ────────────────────────────────────────────────────────────
function CounsellorApp() {
  const [stack, setStack] = React.useState([]);
  const navigation = {
    navigate: (screen, params) => setStack(prev => [...prev, { screen, params }]),
    goBack: () => setStack(prev => prev.slice(0, -1)),
  };
  const topOfStack = stack[stack.length - 1];
  return (
    <View style={styles.root}>
      <View style={{ flex: 1 }}>
        <CounsellorDashboard navigation={navigation} />
      </View>
      {topOfStack && (
        <View style={StyleSheet.absoluteFill}>
          {topOfStack.screen === 'ChangePassword' && <ChangePasswordScreen navigation={navigation} />}
        </View>
      )}
    </View>
  );
}

// ── ROOT NAVIGATOR ────────────────────────────────────────────────────────────
function RootNavigator() {
  const { user, role, loading } = useAuth();

  // Show spinner while checking auth state
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.tealPrimary} />
      </View>
    );
  }

  // Not logged in → show login
  if (!user) {
    return <AuthScreen />;
  }

  // ✅ Immediately route to correct dashboard based on role
  // No flickering — role is loaded BEFORE rendering
  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'counsellor':
      return <CounsellorApp />;
    case 'student':
    default:
      return <StudentApp />;
  }
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7FAFA' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.darkBg },
});
