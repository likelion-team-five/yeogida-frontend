import React from 'react';

    function Button({ message, onConfirm, onCancel}) {
        return (
          <div className="button">
            <div className="btn">
              <h2>{message}</h2>
              <div className="btn-actions">
                <button className="btn-cancel" onClick={onCancel}>
                  취소
                </button>
                <button className="btn-confirm" onClick={onConfirm}>
                  확인
                </button>
              </div>
            </div>
          </div>
        );
      }

export default Button;