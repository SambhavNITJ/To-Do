export const register = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.ITE_REACT_APP_BACKEND_BASEURL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
  
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  

  export const login = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.ITE_REACT_APP_BACKEND_BASEURL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      localStorage.setItem("token", data.token);
  
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  


  