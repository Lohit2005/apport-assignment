import React, { useState, useEffect } from 'react';

const Fetchdata = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState('user'); // Default grouping by user
  const [sortBy, setSortBy] = useState('priority'); // Default sorting by priority
  const [showDropdowns, setShowDropdowns] = useState(false); // State to toggle dropdowns

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const groupTickets = () => {
    const grouped = {};
    tickets.forEach(ticket => {
      let key = '';
      if (groupBy === 'user') {
        const user = users.find(user => user.id === ticket.userId);
        key = user ? user.name : 'Unknown User';
      } else if (groupBy === 'status') {
        key = ticket.status;
      } else if (groupBy === 'priority') {
        key = `Priority ${ticket.priority}`;
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(ticket);
    });
    return grouped;
  };

  const sortTickets = (ticketsToSort) => {
    if (sortBy === 'priority') {
      return ticketsToSort.sort((a, b) => b.priority - a.priority); // Descending order
    } else if (sortBy === 'title') {
      return ticketsToSort.sort((a, b) => a.title.localeCompare(b.title)); // Ascending order
    }
    return ticketsToSort; // Default (no sort)
  };

  const groupedTickets = groupTickets();

  return (
    <div className="container">
      <div className="dropdown">
        <div className="display-dropdown" onClick={() => setShowDropdowns(prev => !prev)}>
          <span>Display</span>
        </div>
        
        {showDropdowns && (
          <div className="nested-dropdowns">
            <div className="dropdown-item">
              <label htmlFor="group-by">Grouping:</label>
              <select
                id="group-by"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <option value="user">User</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div className="dropdown-item">
              <label htmlFor="sort-by">Ordering:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="priority">Priority (Descending)</option>
                <option value="title">Title (Ascending)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grouping-section">
        {Object.entries(groupedTickets).map(([group, tickets]) => (
          <div key={group} className="group-column">
            <div className="group-header">
              <h3>{group}</h3>
            </div>
            {sortTickets(tickets).map(ticket => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-details">
                  <div>{ticket.id}</div>
                  <div>{ticket.title}</div>
                  <div>{ticket.tag[0]}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fetchdata;
