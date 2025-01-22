import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    contact: '',
  });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
    contact: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
      formIsValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      formIsValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
      formIsValid = false;
    }

    // Contact validation
    if (!formData.contact.trim()) {
      newErrors.contact = 'Phone number is required.';
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form before submitting
    if (!validateForm()) {
      setStatus('Please fill out all required fields correctly.');
      return;
    }
  
    // Ensure formData contains the correct fields
    const formDataToSend = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      contact: formData.contact,
    };
  
    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setStatus(result.success);
        setFormData({ name: '', email: '', message: '', contact: '' });
        alert("Data successfully submitted");
      } else {
        setStatus('Failed to submit message.');
      }
    } catch (error) {
      setStatus('Failed to submit message.');
      console.error(error);
    }
  };
  

  return (
    <div>
      {/* Contact Section */}
      <div className="container-fluid contact py-5 bg-light">
        <div className="container py-5">
          <div className="p-5 bg-light rounded">
            <div className="row g-4">

              {/* Contact Header */}
              <div className="col-12 text-center mx-auto" style={{ maxWidth: '700px' }}>
                <h1 className="text-success">Get in touch</h1>
                {status && <p className="text-primary">{status}</p>}
              </div>

              {/* Google Map */}
              <div className="col-lg-12">
                <div className="h-100 rounded">
                  <iframe
                    className="rounded w-100"
                    style={{ height: '400px' }}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d377579.8461143707!2d72.7404848!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c80f09b4d1f7%3A0x80c3bb67b6267388!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sbd!4v1694260123456!5m2!1sen!2sbd"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-lg-7">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-100 form-control py-3 mb-4"
                    placeholder="Your Name"
                    style={{ border: '1px solid lightgreen' }}
                  />
                  {errors.name && <p className="text-danger">{errors.name}</p>}

                  <input
  type="text"
  name="contact"
  value={formData.contact}
  onChange={handleChange}
  className="w-100 form-control py-3 mb-4"
  placeholder="Your Phone Number"
  style={{ border: '1px solid lightgreen' }}
/>
{errors.contact && <p className="text-danger">{errors.contact}</p>}

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-100 form-control py-3 mb-4"
                    placeholder="Enter Your Email"
                    style={{ border: '1px solid lightgreen' }}
                  />
                  {errors.email && <p className="text-danger">{errors.email}</p>}

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-100 form-control mb-4"
                    rows="5"
                    placeholder="Your Message"
                    style={{ border: '1px solid lightgreen' }}
                  ></textarea>
                  {errors.message && <p className="text-danger">{errors.message}</p>}

                  <button
                    className="w-100 btn form-control py-3 bg-success text-white"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="col-lg-5">
                <div className="d-flex p-4 rounded mb-4 bg-white">
                  <i className="fas fa-map-marker-alt fa-2x text-success me-4"></i>
                  <div>
                    <h4 className="text-success">Address</h4>
                    <p className="mb-2">Mumbai</p>
                  </div>
                </div>
                <div className="d-flex p-4 rounded mb-4 bg-white">
                  <i className="fas fa-envelope fa-2x text-success me-4"></i>
                  <div>
                    <h4 className="text-success">Mail Us</h4>
                    <p className="mb-2">abc@gmail.com</p>
                  </div>
                </div>
                <div className="d-flex p-4 rounded bg-white">
                  <i className="fa fa-phone-alt fa-2x text-success me-4"></i>
                  <div>
                    <h4 className="text-success">Telephone</h4>
                    <p className="mb-2">1234567890</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
