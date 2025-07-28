// Modal Functionality Module
export class ModalManager {
    constructor() {
        this.successModal = document.getElementById('success-modal');
        this.initializeModal();
    }

    initializeModal() {
        // Make closeModal function globally available for the onclick attribute
        window.closeModal = () => this.closeModal();
    }

    showSuccessModal() {
        if (this.successModal) {
            this.successModal.style.display = 'flex';
            // Add celebration animation
            setTimeout(() => {
                const confetti = document.querySelectorAll('.confetti-piece');
                confetti.forEach((piece, index) => {
                    piece.style.animationDelay = `${index * 0.1}s`;
                });
            }, 100);
        }
    }

    closeModal() {
        if (this.successModal) {
            this.successModal.style.display = 'none';
        }
    }
} 