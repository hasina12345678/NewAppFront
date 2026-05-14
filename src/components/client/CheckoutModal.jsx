import { useState, useEffect } from 'react';
import { saveAddress, saveShipping, savePayment, saveOrder } from '../../services/serv_checkout';
import { getCart } from '../../services/serv_panier';
import { getCurrentCustomer } from '../../services/serv_auth';
import { loadCountries } from '../../services/serv_countries';

function CheckoutModal({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countries, setCountries] = useState([]);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        city: '',
        postcode: '',
        country: 'FR',
        phone: ''
    });

    // Charger les pays
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await loadCountries();
                setCountries(response.data || []);
            } catch (error) {
                console.error('Erreur chargement pays:', error);
            }
        };
        fetchCountries();
    }, []);

    // Charger les données client
    useEffect(() => {
        const loadData = async () => {
            const user = getCurrentCustomer();
            
            setFormData({
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                email: user?.email || '',
                address: '',
                city: '',
                postcode: '',
                country: 'FR',
                phone: ''
            });
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const addressData = {
                billing: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    address: [formData.address],
                    city: formData.city,
                    country: formData.country,
                    state: formData.city,
                    postcode: formData.postcode,
                    phone: formData.phone
                },
                shipping: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    address: [formData.address],
                    city: formData.city,
                    country: formData.country,
                    state: formData.city,
                    postcode: formData.postcode,
                    phone: formData.phone
                }
            };
            
            await saveAddress(addressData);
            await saveShipping('free_free');
            await savePayment('cashondelivery');
            await saveOrder();
            
            if (onSuccess) onSuccess();
            onClose();
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                width: '500px',
                maxHeight: '90%',
                overflow: 'auto'
            }}>
                <h2>Validation de la commande</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Prénom *</label>
                        <input name="first_name" value={formData.first_name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Nom *</label>
                        <input name="last_name" value={formData.last_name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Email *</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Téléphone *</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Adresse *</label>
                        <input name="address" value={formData.address} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Ville *</label>
                        <input name="city" value={formData.city} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Code postal *</label>
                        <input name="postcode" value={formData.postcode} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Pays *</label>
                        <select name="country" value={formData.country} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }}>
                            {countries.map(c => (
                                <option key={c.id} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.75rem', cursor: 'pointer' }}>Annuler</button>
                        <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#4caf50', color: 'white', border: 'none', cursor: 'pointer' }}>
                            {loading ? 'Commande en cours...' : 'Confirmer la commande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CheckoutModal;