// Supabase DB connection
const supabaseClient = supabase.createClient(
  'https://dcpzpbmkfxzzxofyrzvu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjcHpwYm1rZnh6enhvZnlyenZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NDIxMTIsImV4cCI6MjA2MTExODExMn0.33Bn9eVPv-Z7GuQNUPEBZ8xcdhokJ67hAMUdlhjdUok',
  {
    auth: { storage: sessionStorage }
  }
);

async function checkUser() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    window.location.href = 'mpl_login.html';
  }
}

checkUser();

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (!session?.user) {
    window.location.href = 'mpl_login.html';
  }
});

async function fetchAndDisplayPlayers(sortByOwner = true) {
  // Get the current user
  const { data: { user } } = await supabaseClient.auth.getUser();

  // Fetch all players
  const { data, error } = await supabaseClient
    .from('players')
    .select(`
      id,
      owner (
        id,
        username
      ),
      person (
        username,
        points
      )
    `);

  if (error) {
    console.error('Error fetching players:', error);
    return;
  }

  // Filter out players where current user is the owner
  const filteredData = data.filter(
    (player) => player.owner?.id !== user.id
  );

  const sortedData = filteredData.sort((a, b) => {
    const keyA = sortByOwner
      ? a.owner?.username?.toLowerCase() || ''
      : a.person?.username?.toLowerCase() || '';
    const keyB = sortByOwner
      ? b.owner?.username?.toLowerCase() || ''
      : b.person?.username?.toLowerCase() || '';
    return keyA.localeCompare(keyB);
  });

  // Fill the right column
  const rightColumn = document.querySelectorAll('.column')[1];
  rightColumn.innerHTML = '';

  sortedData.forEach((player) => {
    const container = document.createElement('div');
    container.classList.add('player-entry');

    const playerInfo = document.createElement('div');
    playerInfo.classList.add('player-info');
    playerInfo.textContent = `${player.person?.username || 'Unknown'}\t\tOverall Points: ${player.person?.points || 0}`;

    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.min = '0';
    valueInput.max = '100000';
    valueInput.classList.add('value-input');


    const tradeButton = document.createElement('button');
    tradeButton.textContent = 'Trade';
    tradeButton.classList.add('trade-btn');
    tradeButton.onclick = async () => {
      if (valueInput.value) {
        if (confirm(`Confirm trade offer of ${player.person?.username} for $${valueInput.value}`)) {
          await createTrade(valueInput.value, user.id, player);
        }
        valueInput.value = null;
      }
    };

    container.appendChild(playerInfo);
    container.appendChild(valueInput);
    container.appendChild(tradeButton);
    rightColumn.appendChild(container);
  });
}

async function fireSale(id) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  const { } = await supabaseClient
    .from('players')
    .update({ owner: null , active: false })
    .eq('id', id);

  const { } = await supabaseClient.rpc('increment_money', {
    amount: 500,
    user_id: user.id
  });

  fetchAndDisplayPlayers(false);
  fetchAndDisplayPlayersYouOwn();
  displayUserProfile();
}

async function createTrade(price, buyer, player) {
  if (player.owner == null && price >= 500) {
    const { data, error } = await supabaseClient
      .from('players')
      .update({ owner: buyer })
      .eq('id', player.id)
      .is('owner', null);

    if (error) {
      return;
    }

    setTimeout(() => {
      const { } = supabaseClient.rpc('increment_money', {
        amount: -1 * price,
        user_id: buyer
      });

      fetchAndDisplayPlayers(false);
      fetchAndDisplayPlayersYouOwn();
      displayUserProfile();
    }, "1000");
  } else {
    const { } = await supabaseClient.rpc('CreateTrade', {
      trade_price: price,
      trade_seller: player.owner?.id,
      trade_buyer: buyer,
      trade_player: player.id
    });
  }
}

async function notifDisplay() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  const { data: trades, error: tradesError } = await supabaseClient
    .from('trades')
    .select('*')
    .eq('seller', user.id);

  const inboxIcon = document.getElementById('inbox-src');
  if (trades.length > 0) {
    inboxIcon.src = 'inboxN.png';
  } else {
    inboxIcon.src = 'inbox.png';
  }
}

async function fetchAndDisplayPlayersYouOwn() {
  // Get the current user
  const { data: { user } } = await supabaseClient.auth.getUser();

  // Fetch all players
  const { data, error } = await supabaseClient
    .from('players')
    .select(`
      id,
      owner (
        id,
        username
      ),
      person (
        username,
        points
      ),
      active
    `);

  if (error) {
    console.error('Error fetching players:', error);
    return;
  }

  // Filter out players where current user is the owner
  const filteredData = data.filter(
    (player) => player.owner?.id === user.id
  );

  const sortedData = filteredData.sort((a, b) => {
    const keyA = a.person?.username?.toLowerCase() || '';
    const keyB = b.person?.username?.toLowerCase() || '';
    return keyA.localeCompare(keyB);
  });

  // Fill the right column
  const rightColumn = document.querySelectorAll('.column')[0];
  rightColumn.innerHTML = '';

  sortedData.forEach((player) => {
    const container = document.createElement('div');
    container.classList.add('player-entry');

    const playerInfo = document.createElement('div');
    playerInfo.classList.add('player-info');
    playerInfo.textContent = `${player.person?.username || 'Unknown'}\t\tOverall Points: ${player.person?.points || 0}`;

    const activeButton = document.createElement('button');
    if (player.active == true) {
      activeButton.textContent = 'Deactivate';
    } else {
      activeButton.textContent = 'Activate';
    }
    activeButton.classList.add('sell-btn');
    activeButton.onclick = async () => {
      await activityStuff(player);
    };

    const saleButton = document.createElement('button');
    saleButton.textContent = 'Sell';
    saleButton.classList.add('sell-btn');
    saleButton.onclick = async () => {
      if (confirm(`Confirm sale of ${player.person?.username} for $500`)) {
        await fireSale(player.id);
      }
    };

    container.appendChild(playerInfo);
    container.appendChild(activeButton);
    container.appendChild(saleButton);
    rightColumn.appendChild(container);
  });
}

async function activityStuff(player) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  const { data, error, count } = await supabaseClient
    .from('players')
    .select('id', { count: 'exact' })
    .eq('owner', user.id)
    .eq('active', true);

  if (player.active == true) {
    const { error: updateError } = await supabaseClient
      .from('players')
      .update({ active: false })
      .eq('id', player.id);
    fetchAndDisplayPlayersYouOwn();
    return;
  }

  if (count < 2) {
    const { data, error, count } = await supabaseClient
      .from('players')
      .update({ active: true })
      .eq('id', player.id)
  } else {
    alert("Too Many Active Players")
  }
  fetchAndDisplayPlayersYouOwn();
}

async function displayUserProfile() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('username, points, money, leaguePoints')
    .eq('id', user.id)
    .single();

  const banner = document.getElementById('top-banner');
  banner.innerHTML = `<span>${profile.username}</span><span style="margin-left: 2em;">League Points: ${profile.leaguePoints}</span><span style="margin-left: 2em;">Money: ${profile.money}</span>`;
  return;
}

document.getElementById('logout-btn').addEventListener('click', handleLogout);

async function handleLogout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      console.log('Logged out successfully');
    }
  }

window.addEventListener('DOMContentLoaded', () => {
  displayUserProfile();
  fetchAndDisplayPlayers(false);
  fetchAndDisplayPlayersYouOwn();
  notifDisplay();
  setTimeout(() => {
    const overlay = document.getElementById('overlay-panel');
    if (overlay) {
      overlay.style.opacity = '1';
    }
  }, 1000); // 5 seconds
});

const modalHTML = `
  <div id="inbox-modal" class="modal-overlay">
    <div class="modal-content">
      <button id="close-modal" class="close-btn">✖</button>
      <iframe src="mpl_inbox.html" class="modal-iframe"></iframe>
    </div>
  </div>
`;

const body = document.body;

// Open modal: insert modal HTML into DOM
document.getElementById('inbox-btn').addEventListener('click', () => {
  // Only add if modal is not already there
  if (!document.getElementById('inbox-modal')) {
    body.insertAdjacentHTML('beforeend', modalHTML);

    // Add close button listener after modal is added
    document.getElementById('close-modal').addEventListener('click', () => {
      const modal = document.getElementById('inbox-modal');
      if (modal) {
        modal.remove();
      }
      displayUserProfile();
      fetchAndDisplayPlayers(false);
      fetchAndDisplayPlayersYouOwn();
      notifDisplay();
    });
  }
});
