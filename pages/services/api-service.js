// api-service.js
class ApiService {
    constructor() {
      this.baseUrl = 'https://api.example.com/exoplanets';
      this.cachedData = null;
      this.lastFetchTime = null;
      this.cacheExpiration = 5 * 60 * 1000; // 5 minutes
    }
    
    async getPlanets() {
      // Check if we have cached data that's still valid
      if (this.cachedData && this.lastFetchTime && 
          (Date.now() - this.lastFetchTime < this.cacheExpiration)) {
        console.log('Using cached planet data');
        return this.cachedData;
      }
      
      try {
        // Simulate network request - in a real app, use fetch here
        console.log('Fetching fresh planet data');
        
        // In real implementation, replace with:
        // const response = await fetch(`${this.baseUrl}/planets`);
        // const data = await response.json();
        
        // Simulated data (same as defined in home-page.js)
        const data = [
          {
            id: 'kepler-22b',
            name: 'Кеплер-22b',
            type: 'habitable',
            image: 'images/Kepler-22_b.jpg',
            description: 'Нарны системтэй төстэй одны амьдрах боломжтой бүсийн анхны баталгаажсан гариг.'
          },
          {
            id: 'proxima-centauri-b',
            name: 'Проксима Центавр b',
            type: 'close',
            image: 'images/Centaur_b.jpg',
            description: 'Бидний нарны системд хамгийн ойр байрлах экзогариг.'
          },
          {
            id: 'trappist-1e',
            name: 'TRAPPIST-1e',
            type: 'habitable',
            image: 'images/TRAPPIST-1e.jpg',
            description: 'TRAPPIST-1 системийн долоон дэлхийн хэмжээтэй гаригуудын нэг.'
          },
          {
            id: 'gliese-581g',
            name: 'Глизе 581g',
            type: 'super-earth',
            image: 'images/Gliese_581_g.jpg',
            description: 'Глизе 581 системд амьдрах боломжтой супер-Дэлхий гариг.'
          }
        ];
        
        // Save to cache
        this.cachedData = data;
        this.lastFetchTime = Date.now();
        
        return data;
      } catch (error) {
        console.error('Error fetching planets:', error);
        
        // Try to use cached data even if expired in case of network error
        if (this.cachedData) {
          return this.cachedData;
        }
        
        // Return empty array if no data available
        return [];
      }
    }
    
    async getPlanetDetails(planetId) {
      try {
        // In real implementation, replace with:
        // const response = await fetch(`${this.baseUrl}/planets/${planetId}`);
        // const data = await response.json();
        
        // Simulated network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get basic planet data first
        const planets = await this.getPlanets();
        const basicInfo = planets.find(p => p.id === planetId);
        
        if (!basicInfo) {
          throw new Error(`Planet ${planetId} not found`);
        }
        
        // Add additional details based on planetId
        const details = {
          ...basicInfo,
          fullDescription: `Detailed information about ${basicInfo.name}`,
          physicalProperties: {
            mass: Math.random() * 5 + 0.5, // Earth masses
            radius: Math.random() * 2 + 0.5, // Earth radii
            temperature: Math.round(Math.random() * 60 - 20), // Average surface temperature in Celsius
            gravity: Math.random() * 2 + 0.5, // Earth gravities
          },
          discoveryYear: 2010 + Math.floor(Math.random() * 15),
          distanceFromEarth: Math.round(Math.random() * 100) + " light years",
          starType: ["Red Dwarf", "Yellow Dwarf", "Orange Dwarf", "Blue Giant"][Math.floor(Math.random() * 4)]
        };
        
        return details;
      } catch (error) {
        console.error(`Error fetching details for planet ${planetId}:`, error);
        return null;
      }
    }
    
    async likePlanet(planetId, liked) {
      try {
        // In real implementation, replace with:
        // const response = await fetch(`${this.baseUrl}/planets/${planetId}/like`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ liked })
        // });
        // const data = await response.json();
        
        // Simulated network delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Simulated success response
        return {
          success: true,
          planetId,
          liked,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Error updating like status for planet ${planetId}:`, error);
        return {
          success: false,
          error: error.message
        };
      }
    }
    
    async getFilterOptions() {
      try {
        // Simulated network delay
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Simulated filter options (same as in home-page.js)
        return [
          { label: 'Бүгд', value: 'all' },
          { label: 'Амьдрах боломжтой', value: 'habitable' },
          { label: 'Хамгийн ойрхон', value: 'close' },
          { label: 'Супер дэлхий', value: 'super-earth' }
        ];
      } catch (error) {
        console.error('Error fetching filter options:', error);
        return [];
      }
    }
  }
  
  // Create a singleton instance
  const apiService = new ApiService();
  
  export default apiService;