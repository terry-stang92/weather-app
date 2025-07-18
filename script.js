
// Datos mock del clima para simular una API real
const mockWeatherData = {
    "Madrid": {
        current: {
            city: "Madrid",
            temperature: 22,
            description: "Soleado",
            icon: "fas fa-sun",
            feelsLike: 25,
            humidity: 65,
            windSpeed: 12,
            visibility: 10
        },
        forecast: [
            { day: "Hoy", icon: "fas fa-sun", high: 22, low: 15 },
            { day: "Mañana", icon: "fas fa-cloud-sun", high: 20, low: 13 },
            { day: "Sábado", icon: "fas fa-cloud-rain", high: 18, low: 11 },
            { day: "Domingo", icon: "fas fa-cloud", high: 19, low: 12 },
            { day: "Lunes", icon: "fas fa-sun", high: 23, low: 16 }
        ]
    },
    "Helsinki": {
        current: {
            city: "Helsinki",
            temperature: -2,
            description: "Nevando",
            icon: "fas fa-snowflake",
            feelsLike: -5,
            humidity: 85,
            windSpeed: 15,
            visibility: 5
        },
        forecast: [
            { day: "Hoy", icon: "fas fa-snowflake", high: -2, low: -8 },
            { day: "Mañana", icon: "fas fa-cloud-snow", high: -1, low: -7 },
            { day: "Sábado", icon: "fas fa-cloud", high: 1, low: -5 },
            { day: "Domingo", icon: "fas fa-cloud-sun", high: 3, low: -3 },
            { day: "Lunes", icon: "fas fa-sun", high: 5, low: -1 }
        ]
    },
    "New York": {
        current: {
            city: "New York",
            temperature: 8,
            description: "Nublado",
            icon: "fas fa-cloud",
            feelsLike: 6,
            humidity: 72,
            windSpeed: 18,
            visibility: 8
        },
        forecast: [
            { day: "Hoy", icon: "fas fa-cloud", high: 8, low: 3 },
            { day: "Mañana", icon: "fas fa-cloud-rain", high: 10, low: 5 },
            { day: "Sábado", icon: "fas fa-cloud-sun", high: 12, low: 7 },
            { day: "Domingo", icon: "fas fa-sun", high: 15, low: 9 },
            { day: "Lunes", icon: "fas fa-cloud", high: 11, low: 6 }
        ]
    },
    "Copenhagen": {
        current: {
            city: "Copenhagen",
            temperature: 1,
            description: "Lluvia ligera",
            icon: "fas fa-cloud-rain",
            feelsLike: -2,
            humidity: 88,
            windSpeed: 20,
            visibility: 6
        },
        forecast: [
            { day: "Hoy", icon: "fas fa-cloud-rain", high: 1, low: -3 },
            { day: "Mañana", icon: "fas fa-cloud", high: 3, low: -1 },
            { day: "Sábado", icon: "fas fa-cloud-sun", high: 5, low: 1 },
            { day: "Domingo", icon: "fas fa-sun", high: 7, low: 3 },
            { day: "Lunes", icon: "fas fa-cloud", high: 4, low: 0 }
        ]
    },
    "Ho Chi Minh City": {
        current: {
            city: "Ho Chi Minh City",
            temperature: 28,
            description: "Caluroso y húmedo",
            icon: "fas fa-sun",
            feelsLike: 32,
            humidity: 78,
            windSpeed: 8,
            visibility: 12
        },
        forecast: [
            { day: "Hoy", icon: "fas fa-sun", high: 28, low: 24 },
            { day: "Mañana", icon: "fas fa-cloud-sun", high: 29, low: 25 },
            { day: "Sábado", icon: "fas fa-cloud-rain", high: 26, low: 22 },
            { day: "Domingo", icon: "fas fa-cloud-rain", high: 27, low: 23 },
            { day: "Lunes", icon: "fas fa-sun", high: 30, low: 26 }
        ]
    }
};

// Variables globales
let currentCity = "Madrid";

// Elementos del DOM
const citySearchInput = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const currentCityElement = document.getElementById('currentCity');
const currentDateElement = document.getElementById('currentDate');
const currentTempElement = document.getElementById('currentTemp');
const currentIconElement = document.getElementById('currentIcon');
const weatherDescElement = document.getElementById('weatherDesc');
const feelsLikeElement = document.getElementById('feelsLike');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const visibilityElement = document.getElementById('visibility');
const forecastContainer = document.getElementById('forecastContainer');

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

/**
 * Inicializa la aplicación con datos por defecto
 */
function initializeApp() {
    updateCurrentDate();
    updateWeatherDisplay(currentCity);
    console.log('Weather App inicializada correctamente');
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    // Búsqueda por botón
    searchBtn.addEventListener('click', handleSearch);
    
    // Búsqueda por Enter
    citySearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Clicks en ciudades populares del sidebar
    const cityItems = document.querySelectorAll('.city-item');
    cityItems.forEach(item => {
        item.addEventListener('click', function() {
            const cityName = this.getAttribute('data-city');
            updateWeatherDisplay(cityName);
            
            // Efecto visual de selección
            cityItems.forEach(ci => ci.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

/**
 * Maneja la búsqueda de ciudades
 */
function handleSearch() {
    const searchTerm = citySearchInput.value.trim();
    
    if (searchTerm === '') {
        showNotification('Por favor, ingresa el nombre de una ciudad', 'warning');
        return;
    }
    
    // Buscar ciudad en los datos mock (búsqueda flexible)
    const foundCity = findCityInData(searchTerm);
    
    if (foundCity) {
        updateWeatherDisplay(foundCity);
        citySearchInput.value = '';
        showNotification(`Mostrando clima para ${foundCity}`, 'success');
    } else {
        showNotification('Ciudad no encontrada. Intenta con: Madrid, Helsinki, New York, Copenhagen o Ho Chi Minh City', 'error');
    }
}

/**
 * Busca una ciudad en los datos mock de forma flexible
 */
function findCityInData(searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase();
    
    // Buscar coincidencia exacta o parcial
    for (const city in mockWeatherData) {
        if (city.toLowerCase().includes(normalizedSearch) || 
            normalizedSearch.includes(city.toLowerCase())) {
            return city;
        }
    }
    
    // Búsquedas alternativas comunes
    const cityAliases = {
        'madrid': 'Madrid',
        'helsinki': 'Helsinki',
        'new york': 'New York',
        'ny': 'New York',
        'nueva york': 'New York',
        'copenhagen': 'Copenhagen',
        'copenhague': 'Copenhagen',
        'ho chi minh': 'Ho Chi Minh City',
        'saigon': 'Ho Chi Minh City',
        'vietnam': 'Ho Chi Minh City'
    };
    
    return cityAliases[normalizedSearch] || null;
}

/**
 * Actualiza toda la información del clima en pantalla
 */
function updateWeatherDisplay(cityName) {
    const weatherData = mockWeatherData[cityName];
    
    if (!weatherData) {
        console.error(`No hay datos para la ciudad: ${cityName}`);
        return;
    }
    
    currentCity = cityName;
    
    // Actualizar información actual
    updateCurrentWeather(weatherData.current);
    
    // Actualizar pronóstico
    updateForecast(weatherData.forecast);
    
    console.log(`Clima actualizado para: ${cityName}`);
}

/**
 * Actualiza la sección del clima actual
 */
function updateCurrentWeather(currentData) {
    currentCityElement.textContent = currentData.city;
    currentTempElement.textContent = `${currentData.temperature}°C`;
    currentIconElement.className = currentData.icon;
    weatherDescElement.textContent = currentData.description;
    feelsLikeElement.textContent = `${currentData.feelsLike}°C`;
    humidityElement.textContent = `${currentData.humidity}%`;
    windSpeedElement.textContent = `${currentData.windSpeed} km/h`;
    visibilityElement.textContent = `${currentData.visibility} km`;
}

/**
 * Actualiza el pronóstico de 5 días
 */
function updateForecast(forecastData) {
    forecastContainer.innerHTML = '';
    
    forecastData.forEach(day => {
        const forecastItem = createForecastItem(day);
        forecastContainer.appendChild(forecastItem);
    });
}

/**
 * Crea un elemento individual del pronóstico
 */
function createForecastItem(dayData) {
    const item = document.createElement('div');
    item.className = 'forecast-item';
    
    item.innerHTML = `
        <div class="forecast-day">${dayData.day}</div>
        <div class="forecast-icon">
            <i class="${dayData.icon}"></i>
        </div>
        <div class="forecast-temps">
            <span class="forecast-high">${dayData.high}°</span>
            <span class="forecast-low">${dayData.low}°</span>
        </div>
    `;
    
    return item;
}

/**
 * Actualiza la fecha actual
 */
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const formattedDate = now.toLocaleDateString('es-ES', options);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    
    currentDateElement.textContent = capitalizedDate;
}

/**
 * Muestra notificaciones al usuario
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos de la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        color: '#ffffff',
        fontWeight: '600',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Colores según el tipo
    const colors = {
        success: 'linear-gradient(45deg, #4CAF50, #45a049)',
        error: 'linear-gradient(45deg, #f44336, #da190b)',
        warning: 'linear-gradient(45deg, #ff9800, #f57c00)',
        info: 'linear-gradient(45deg, #2196F3, #0b7dda)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Función utilitaria para formatear temperaturas
 */
function formatTemperature(temp) {
    return `${Math.round(temp)}°C`;
}

/**
 * Función utilitaria para obtener el icono del clima según la descripción
 */
function getWeatherIcon(description) {
    const iconMap = {
        'soleado': 'fas fa-sun',
        'nublado': 'fas fa-cloud',
        'lluvia': 'fas fa-cloud-rain',
        'nieve': 'fas fa-snowflake',
        'tormenta': 'fas fa-bolt',
        'niebla': 'fas fa-smog'
    };
    
    const lowerDesc = description.toLowerCase();
    
    for (const key in iconMap) {
        if (lowerDesc.includes(key)) {
            return iconMap[key];
        }
    }
    
    return 'fas fa-sun'; // Icono por defecto
}

// Funciones adicionales para futuras mejoras

/**
 * Convierte temperatura de Celsius a Fahrenheit
 */
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

/**
 * Convierte velocidad del viento de km/h a mph
 */
function kmhToMph(kmh) {
    return kmh * 0.621371;
}

/**
 * Obtiene la hora local de una ciudad (simulado)
 */
function getCityLocalTime(cityName) {
    const timezones = {
        'Madrid': 'Europe/Madrid',
        'Helsinki': 'Europe/Helsinki',
        'New York': 'America/New_York',
        'Copenhagen': 'Europe/Copenhagen',
        'Ho Chi Minh City': 'Asia/Ho_Chi_Minh'
    };
    
    try {
        return new Date().toLocaleTimeString('es-ES', {
            timeZone: timezones[cityName] || 'Europe/Madrid'
        });
    } catch (error) {
        return new Date().toLocaleTimeString('es-ES');
    }
}

// Log de inicialización
console.log('Weather App Script cargado correctamente');
console.log('Ciudades disponibles:', Object.keys(mockWeatherData));
