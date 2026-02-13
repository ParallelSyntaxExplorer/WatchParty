import React from 'react';
import { X, Upload, Lock, LogOut, Calendar, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserAccount = ({ user, profile, isOpen, onClose, onLogout, onChangePassword }) => {
  if (!isOpen) return null;

  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A';
  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0];

  return (
    <AnimatePresence>
      <motion.div
        className="profile-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="profile-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="profile-header">
            <h2>My Account</h2>
            <button className="panel-close" onClick={onClose}><X size={24} /></button>
          </div>

          <div className="profile-content">
            <div className="avatar-section">
              <div className="avatar-wrapper">
                {profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                  <img src={profile?.avatar_url || user.user_metadata.avatar_url} alt="Avatar" className="profile-avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    <span className="avatar-emoji">😊</span>
                  </div>
                )}
                <button className="avatar-edit-badge">
                  <UserIcon size={14} />
                </button>
              </div>
              <h3>{displayName}</h3>
              <div className="created-at">
                <Calendar size={14} />
                <span>Created at:: {createdAt}</span>
              </div>
            </div>

            <div className="settings-section">
              <h4><Calendar size={18} style={{ opacity: 0.6 }} /> SETTINGS</h4>

              <div className="settings-grid">
                <button className="settings-button">
                  <div className="setting-icon red-bg">
                    <Upload size={20} />
                  </div>
                  <span>Upload avatar</span>
                </button>

                <button className="settings-button" onClick={onChangePassword}>
                  <div className="setting-icon dark-bg">
                    <Lock size={20} />
                  </div>
                  <span>Change password</span>
                </button>
              </div>
            </div>

            <div className="profile-footer">
              <button className="logout-button" onClick={onLogout}>
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        <style>{`
          .profile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 2500;
            display: flex;
            justify-content: flex-end;
          }

          .profile-panel {
            background: #000;
            width: 100%;
            max-width: 400px;
            height: 100%;
            display: flex;
            flex-direction: column;
            border-left: 1px solid rgba(255,255,255,0.05);
            padding: 30px;
          }

          .profile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 40px;
          }

          .profile-header h2 {
            font-size: 1.5rem;
            font-weight: 700;
          }

          .panel-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            opacity: 0.6;
            transition: 0.3s;
          }
          .panel-close:hover { opacity: 1; transform: scale(1.1); }

          .profile-content {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .avatar-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 50px;
          }

          .avatar-wrapper {
            position: relative;
            margin-bottom: 20px;
          }

          .avatar-placeholder {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #ff4d4d, #e50914);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            box-shadow: 0 10px 30px rgba(229, 9, 20, 0.3);
          }

          .avatar-emoji { transform: translateY(2px); }

          .avatar-edit-badge {
            position: absolute;
            bottom: 5px;
            right: 5px;
            background: #222;
            border: 2px solid #000;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            cursor: pointer;
          }

          .avatar-section h3 {
            font-size: 1.8rem;
            font-weight: 800;
            margin-bottom: 10px;
          }

          .created-at {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
            font-size: 0.95rem;
          }

          .settings-section h4 {
            font-size: 0.9rem;
            letter-spacing: 1px;
            color: #888;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .settings-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .settings-button {
            background: #0a0a0a;
            border: 1px solid #1a1a1a;
            padding: 16px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 15px;
            cursor: pointer;
            transition: 0.3s;
            color: white;
            text-align: left;
          }

          .settings-button:hover {
            border-color: #333;
            background: #111;
          }

          .setting-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .red-bg { background: rgba(229, 9, 20, 0.15); color: #e50914; }
          .dark-bg { background: rgba(255, 255, 255, 0.05); color: #666; }

          .settings-button span {
            font-weight: 600;
            font-size: 1rem;
          }

          .profile-footer {
            margin-top: auto;
            padding-top: 20px;
          }

          .logout-button {
            width: 100%;
            background: #e50914;
            color: white;
            padding: 16px;
            border-radius: 14px;
            border: none;
            font-weight: 700;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            cursor: pointer;
            transition: 0.3s;
          }

          .logout-button:hover {
            background: #ff0f1a;
            transform: translateY(-2px);
          }

          @media (max-width: 600px) {
              .account-sidebar {
                  width: 100%;
                  border-radius: 0;
              }
              .avatar-section h3 { font-size: 1.5rem; }
              .sidebar-content { padding: 30px 20px; }
              .settings-button { padding: 12px; }
              .setting-icon { width: 36px; height: 36px; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserAccount;
