import React, { useState } from 'react';
import { X, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authActions } from '../services/supabase';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { error } = await authActions.updatePassword(newPassword);
            if (error) throw error;
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setNewPassword('');
                setConfirmPassword('');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="modal-card"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <div className="modal-header">
                        <h3>Change password</h3>
                        <button className="modal-close" onClick={onClose}><X size={20} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="modal-input-group active">
                            <Lock className="modal-icon" size={18} />
                            <input
                                type="password"
                                placeholder="Old password"
                                required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="modal-input-group">
                            <Lock className="modal-icon" size={18} />
                            <input
                                type="password"
                                placeholder="New password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="modal-input-group">
                            <Lock className="modal-icon" size={18} />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="modal-error">{error}</p>}
                        {success && <p className="modal-success">Password updated successfully!</p>}

                        <div className="modal-actions">
                            <button type="submit" className="confirm-btn" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </motion.div>

                <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(8px);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-card {
            background: #0a0a0a;
            width: 100%;
            max-width: 400px;
            padding: 24px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.05);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .modal-header h3 {
            font-size: 1.2rem;
            font-weight: 700;
          }

          .modal-close {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
          }

          .modal-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .modal-input-group {
            position: relative;
            display: flex;
            align-items: center;
          }

          .modal-icon {
            position: absolute;
            left: 16px;
            color: #444;
          }

          .modal-input-group input {
            width: 100%;
            padding: 16px 16px 16px 48px;
            background: #111;
            border: 1px solid #222;
            border-radius: 12px;
            color: white;
            font-size: 1rem;
            transition: 0.3s;
          }

          .modal-input-group.active input {
              border-color: #800; /* Subtle red border from screenshot */
          }

          .modal-input-group input:focus {
            outline: none;
            border-color: #e50914;
          }

          .modal-actions {
            display: flex;
            gap: 12px;
            margin-top: 10px;
          }

          .confirm-btn {
            flex: 1;
            background: #e50914;
            color: white;
            padding: 14px;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s;
          }

          .cancel-btn {
            flex: 1;
            background: rgba(255,255,255,0.05);
            color: white;
            padding: 14px;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s;
          }

          .confirm-btn:hover { background: #ff0f1a; }
          .cancel-btn:hover { background: rgba(255,255,255,0.1); }

          .modal-error { color: #ff4d4d; font-size: 0.85rem; text-align: center; }
          .modal-success { color: #4ade80; font-size: 0.85rem; text-align: center; }

          .animate-spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChangePasswordModal;
