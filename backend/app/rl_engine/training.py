import numpy as np
import os
from app.rl_engine.environment import BudgetEnvironment
from app.rl_engine.agents.dqn import DQNAgent

def train_agent(user_profile, episodes=500, save_path="models/dqn_model.pth"):
    """
    Trains the DQN agent for a specific user profile.
    
    Args:
        user_profile (dict): User profile data including income and risk preference.
        episodes (int): Number of episodes to train.
        save_path (str): Path to save the trained model weights.
    """
    # Initialize environment
    env = BudgetEnvironment(user_profile)
    
    # Get dimensions from environment
    state_dim = env.observation_space.shape[0]
    action_dim = env.action_space.n
    
    # Initialize agent
    agent = DQNAgent(state_dim, action_dim)
    
    # Ensure model directory exists
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    rewards_history = []
    print(f"Starting training for {episodes} episodes...")
    print(f"Profile: Income={user_profile.get('monthlyIncome')}, Risk={user_profile.get('riskPreference')}")
    
    for e in range(episodes):
        state, _ = env.reset()
        total_reward = 0
        done = False
        
        while not done:
            # Select action
            action = agent.select_action(state)
            
            # Take step
            next_state, reward, terminated, truncated, _ = env.step(action)
            done = terminated or truncated
            
            # Store experience in replay buffer
            agent.remember(state, action, reward, next_state, done)
            
            # Train the agent
            agent.replay()
            
            state = next_state
            total_reward += reward
            
        # Update target network periodically
        if e % 10 == 0:
            agent.update_target_network()
            
        rewards_history.append(total_reward)
        
        # Log progress
        if (e + 1) % 50 == 0:
            avg_reward = np.mean(rewards_history[-50:])
            print(f"Episode {e+1}/{episodes} | Avg Reward: {avg_reward:.2f} | Epsilon: {agent.epsilon:.4f}")
            
    # Save the trained model
    agent.save(save_path)
    print(f"Training complete. Model saved to {save_path}")
    
    return agent, rewards_history

if __name__ == "__main__":
    # Example usage for testing
    dummy_profile = {
        "monthlyIncome": 50000,
        "riskPreference": "moderate"
    }
    
    # Run training
    train_agent(dummy_profile, episodes=200, save_path="models/dqn_test.pth")